import build from "next/dist/build";
import {
  callGetSuperclasses,
  callNearestCommonAncestors,
} from "../middleware/api";

export class BabelnetEntity {
  main_sense: string = "";
  description: string | null = null;
  synonyms: string[] = [];
  image_url: string | null = null;

  constructor(
    main_sense: string,
    description: string | null = null,
    synonyms: string[] = [],
    image_url: string | null = null
  ) {
    this.main_sense = main_sense;
    this.description = description;
    this.synonyms = synonyms;
    this.image_url = image_url;
  }

  static fromJson(json: any) {

    if (!json.main_sense) {
      throw new Error("JSON is not a BabelnetEntity");
    }

    return new BabelnetEntity(
      json.main_sense,
      json.description ? json.description : null,
      json.synonyms ? json.synonyms : [],
      json.image_url ? json.image_url : null
    );
  }
}

export enum TermType {
  CONSTANT = "CONSTANT",
  FREE_VARIABLE = "FREE_VARIABLE",
  BOUND_VARIABLE = "BOUND_VARIABLE",
  AGGREGATED_TERM = "AGGREGATED_TERM",
}
export class Term {
  compareTo(other: Term): boolean {
    if (!(other instanceof Term)) {
      throw new Error(`Term.compareTo: other is not a Term\n`);
    }

    if (this.type !== other.type) {
      return false;
    }
    if (this.name.length !== other.name.length) {
      return false;
    }
    return JSON.stringify(this.name) === JSON.stringify(other.name);
  }

  compareToJustConstants(other: Term): boolean {
    if (!(other instanceof Term)) {
      throw new Error(`Term.compareTo: other is not a Term\n`);
    }

    if (this.type !== other.type) {
      return false;
    }
    if (this.name.length !== other.name.length) {
      return false;
    }
    return this.type === TermType.CONSTANT ||
      this.type === TermType.AGGREGATED_TERM
      ? JSON.stringify(this.name) === JSON.stringify(other.name)
      : true;
  }

  name: string[] = [];
  type: TermType = TermType.CONSTANT;
  babelNetEntity: BabelnetEntity | null = null;

  constructor(
    name: string[],
    type: TermType,
    babelNetEntity: BabelnetEntity | null = null
  ) {
    this.name = name;
    this.type = type;
    this.babelNetEntity = babelNetEntity;
  }

  static fromJson(json: any) {
    if (!json) {
      throw new Error("JSON is not a Term");
    }

    if (!json.name || !json.type) {
      throw new Error("JSON is not a Term");
    }

    return new Term(
      json.name,
      json.type,
      json.babelNetEntity ? BabelnetEntity.fromJson(json.babelNetEntity) : null
    );
  }

  static spread(term: Term): Term[] {
    if (term.type !== TermType.AGGREGATED_TERM) {
      return [term];
    }
    let terms: Term[] = [];
    term.name.forEach((n) => {
      terms.push(new Term([n], TermType.CONSTANT, null));
    });
    return terms;
  }
}

export enum PredicateType {
  HOLONYM = "HOLONYM",
  MERONYM = "MERONYM",
  HYPERNYM = "HYPERNYM",
  HYPONYM = "HYPONYM",
  OTHER = "OTHER",
  TOP = "TOP",
}

export class Predicate {
  type: PredicateType = PredicateType.OTHER;
  name: string = "";
  terms: Term[] = [];
  is_deriv: boolean = false;

  constructor(
    type: PredicateType,
    name: string,
    terms: Term[],
    is_deriv: boolean = false
  ) {
    this.type = type;
    this.name = name;
    this.terms = terms;
    this.is_deriv = is_deriv;
  }

  static fromJson(json: any) {

    if (!json.type || !json.name || !json.terms) {
      throw new Error("JSON is not a Predicate");
    }

    return new Predicate(
      json.type,
      json.name,
      json.terms.map((t: any) => Term.fromJson(t)),
      json.is_deriv ? json.is_deriv : false
    );
  }

  static fromArrays(list: Formula[] | undefined): Predicate[][] {
    if (!list) {
      throw new Error("Cannot parse undefined in Predicate.fromArrays");
    }
    const externalList = [] as Predicate[][];
    list.forEach((internal: Formula) => {
      const internalList = [] as Predicate[];
      internal.predicates.forEach((element: any) => {
        try {
          internalList.push(Predicate.fromJson(element));
        } catch (e) {
          console.error(e);
        }
      });
      externalList.push(internalList);
    });
    return externalList;
  }

  static compareByValue(p1: Predicate, p2: Predicate): boolean {
    return (
      p1.name == p2.name &&
      ((p1.terms[1].type == TermType.BOUND_VARIABLE &&
        p2.terms[1].type == TermType.BOUND_VARIABLE) ||
        (p1.terms[1].name.every((t) => {
          return p2.terms[1].name.includes(t);
        }) &&
          p2.terms[1].name.every((t) => {
            return p1.terms[1].name.includes(t);
          })))
    );
  }

  static spread(predicate: Predicate, previous: Predicate[]): Predicate[] {
    let newPredicates: Predicate[] = [];
    let predicateTerms: Term[][] = [];
    predicate.terms.forEach((term) => {
      predicateTerms.push(Term.spread(term));
    });
    if (predicateTerms.length === 1) {
      return predicateTerms[0].map(
        (t) => new Predicate(predicate.type, predicate.name, [t])
      );
    } else if (predicateTerms.length === 2) {
      for (let i = 0; i < predicateTerms[0].length; i++) {
        for (let j = 0; j < predicateTerms[1].length; j++) {
          const p = new Predicate(
            predicate.type,
            predicate.name,
            [predicateTerms[0][i], predicateTerms[1][j]],
            predicate.is_deriv
          );
          if (
            !Predicate.find(previous, p) &&
            !Predicate.find(newPredicates, p)
          ) {
            newPredicates.push(p);
          }
        }
      }
      return newPredicates;
    }
    console.error("Predicate with more than 2 terms or 0 terms not supported.");
    return [];
  }
  static find(array: Predicate[], p: Predicate): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i].compareTo(p)) {
        return true;
      }
    }
    return false;
  }

  compareTo(p: Predicate): boolean {
    if (this.name !== p.name) {
      return false;
    }
    if (this.terms.length !== p.terms.length) {
      return false;
    }
    if (this.type !== p.type) {
      return false;
    }

    for (let i = 0; i < this.terms.length; i++) {
      if (!this.terms[i].compareTo(p.terms[i])) {
        return false;
      }
    }

    return true;
  }

  compareToJustConstants(p: Predicate): boolean {
    if (this.name !== p.name) {
      return false;
    }
    if (this.terms.length !== p.terms.length) {
      return false;
    }
    if (this.type !== p.type) {
      return false;
    }

    for (let i = 0; i < this.terms.length; i++) {
      if (!this.terms[i].compareToJustConstants(p.terms[i])) {
        return false;
      }
    }

    return true;
  }

  static predComparison(p1: Predicate, p2: Predicate): boolean {
    return (
      p1.name == p2.name &&
      ((p1.terms[1].type == TermType.BOUND_VARIABLE &&
        p2.terms[1].type == TermType.BOUND_VARIABLE) ||
        (p1.terms[1].name.every((t) => {
          return p2.terms[1].name.includes(t);
        }) &&
          p2.terms[1].name.every((t) => {
            return p1.terms[1].name.includes(t);
          })))
    );
  }

  toString(
    nameBeaufier: (name: string) => string,
    termBeautifier: (term: Term) => string
  ) {
    return (
      nameBeaufier(this.name) +
      " " +
      "(" +
      this.terms.map((t) => termBeautifier(t)).join(", ") +
      ")"
    );
  }
}

export class Formula {
  
  predicates: Predicate[] = [];

  constructor(predicates: Predicate[]) {
    this.predicates = predicates;
  }

  static fromJson(json: any) {

    if (!json.predicates) {
      throw new Error("JSON is not a Formula");
    }

    return new Formula(json.predicates.map((p: any) => Predicate.fromJson(p)));
  }

  spread() {
    let spreadedPredicates: Predicate[] = [];
    this.predicates.forEach((predicate) => {
      spreadedPredicates.push(
        ...Predicate.spread(predicate, spreadedPredicates)
      );
    });
    return new Formula(spreadedPredicates);
  }

  collapse() {
    const reachedTerms: Record<string, number> = {}
    const toKeepSpread:string[] = []
    const newFormula = this.spread()
    newFormula.predicates.forEach((predicate) => {
      let x:string = predicate.terms[1].name[0]
      if(!reachedTerms[x]) {
        reachedTerms[x] = 1;
      } else {
        reachedTerms[x]++;
        toKeepSpread.push(x);
      }
    });

    const newPredicates:Predicate[] = newFormula.predicates.reduce((result, pred) => {
      let found = result.findIndex((p) => {
        return (
          p.name == pred.name &&
          !toKeepSpread.includes(p.terms[1].name[0])
        );
      });
      if (found == -1) {
        result.push(new Predicate(pred.type, pred.name, [new Term([...pred.terms[0].name], pred.terms[0].type, pred.terms[0].babelNetEntity), new Term([...pred.terms[1].name], pred.terms[1].type, pred.terms[1].babelNetEntity)], pred.is_deriv));
      }
      else {
        
        result[found].terms[1].type = TermType.AGGREGATED_TERM;
        result[found].terms[1].name.push(pred.terms[1].name[0]);
      }

      return result;
    }, [] as Predicate[]);

    return new Formula(newPredicates);
  }
}

export class SummaryConfigEntry {
  predicate_type: PredicateType = PredicateType.OTHER;
  predicate_name: string = "";
  depth: number = 1;

  constructor(
    predicate_type: PredicateType,
    predicate_name: string,
    depth: number
  ) {
    this.predicate_type = predicate_type;
    this.predicate_name = predicate_name;
    this.depth = depth;
  }

  static fromJson(json: any) {

    if (!json.predicate_type || !json.predicate_name || !json.depth) {
      throw new Error("JSON is not a SummaryConfigEntry");
    }

    return new SummaryConfigEntry(
      json.predicate_type,
      json.predicate_name,
      json.depth
    );
  }
}

export enum AncestorStrategy {
  ALL_NEAREAST = "ALL_NEAREAST",
  UP_TO_LEVEL = "UP_TO_LEVEL",
}

export enum SummaryStrategy {
  NO_SUMMARY = "NO_SUMMARY",
  UP_TO_CONFIG = "UP_TO_CONFIG",
  UP_TO_FUNC_STRATEGY = "UP_TO_FUNC_STRATEGY",
}

export enum OptimizationStrategy {
  NO_OPT = "NO_OPT",
  PRUNE_COMMON_INFO = "PRUNE_COMMON_INFO",
  FULL_OPT = "FULL_OPT",
}

export class SummaryConfig {
  included_types: SummaryConfigEntry[] = [];
  ancestor_strategy: AncestorStrategy = AncestorStrategy.ALL_NEAREAST;
  summary_strategy: SummaryStrategy = SummaryStrategy.NO_SUMMARY;
  optimization_strategy: OptimizationStrategy = OptimizationStrategy.NO_OPT;
  include_top: boolean = false;
  beautify: boolean = false;

  constructor(
    included_types: SummaryConfigEntry[],
    ancestor_strategy: AncestorStrategy,
    summary_strategy: SummaryStrategy,
    optimization_strategy: OptimizationStrategy,
    include_top: boolean,
    beautify: boolean
  ) {
    this.included_types = included_types;
    this.ancestor_strategy = ancestor_strategy;
    this.summary_strategy = summary_strategy;
    this.optimization_strategy = optimization_strategy;
    this.include_top = include_top;
    this.beautify = beautify;
  }

  static fromJson(json: any) {

    if (
      !json.included_types ||
      !json.ancestor_strategy ||
      !json.summary_strategy ||
      !json.optimization_strategy
    ) {
      throw new Error("JSON is not a SummaryConfig");
    }

    return new SummaryConfig(
      json.included_types.map((t: any) => SummaryConfigEntry.fromJson(t)),
      json.ancestor_strategy,
      json.summary_strategy,
      json.optimization_strategy,
      json.include_top,
      json.beautify
    );
  }
}

export class SummaryTerm {
  id: string = "";
  occurrences: number = 0;
  full_repr: Term | null = null;

  constructor(id: string, occurrences: number, full_repr: Term | null = null) {
    this.id = id;
    this.occurrences = occurrences;
    this.full_repr = full_repr;
  }

  static fromJson(json: any) {

    if (!json.id || !json.occurrences) {
      throw new Error("JSON is not a SummaryTerm");
    }

    return new SummaryTerm(
      json.id,
      json.occurrences,
      json.full_repr ? Term.fromJson(json.full_repr) : null
    );
  }
}

export class Summary {
  atoms: Formula = new Formula([]);
  terms: SummaryTerm[] = [];

  constructor(atoms: Formula, terms: SummaryTerm[]) {
    this.atoms = atoms;
    this.terms = terms;
  }

  static fromJson(json: any) {

    if (!json.atoms || !json.terms) {
      throw new Error("JSON is not a Summary");
    }

    return new Summary(
      Formula.fromJson(json.atoms),
      json.terms.map((t: any) => SummaryTerm.fromJson(t))
    );
  }
}

export class EntitySummary {
  entity: Term[] = [];
  summary: Summary = new Summary(new Formula([]), []);

  constructor(entity: Term[], summary = new Summary(new Formula([]), [])) {
    this.entity = entity;
    this.summary = summary;
  }

  static fromJson(json: any) {

    if (!json.entity || !json.summary) {
      throw new Error("JSON is not a EntitySummary");
    }

    return new EntitySummary(
      json.entity.map((t: any) => Term.fromJson(t)),
      Summary.fromJson(json.summary)
    );
  }

  static compareEntitySummary(a: EntitySummary, e: EntitySummary): boolean {
    let left = false,
      right = false;
    if (a && a.entity) {
      a.entity.forEach((t) => {
        left = e.entity.some((t2) => {
          return t && t2 && t.compareTo(t2);
        });
      });
    }
    if (e && e.entity) {
      e.entity.forEach((t) => {
        right = a.entity.some((t2) => {
          return t && t2 && t.compareTo(t2);
        });
      });
    }
    return left && right;
  }
}

export class Unit {
  entities: EntitySummary[] = [];
  characterization: Formula | null = new Formula([]);
  expansion: Formula[] | null = null;

  constructor(
    entities: EntitySummary[],
    characterization: Formula | null,
    expansion: Formula[] | null = null
  ) {
    this.entities = entities;
    this.characterization = characterization;
    this.expansion = expansion;
  }

  static fromJson(json: any) {

    if (!json.entities) {
      throw new Error("JSON is not a Unit");
    }

    return new Unit(
      json.entities.map((e: any) => EntitySummary.fromJson(e)),
      json.characterization ? Formula.fromJson(json.characterization) : null,
      json.expansion
        ? json.expansion.map((e: any) => Formula.fromJson(e))
        : null
    );
  }

  static byCopy(unit: Unit): Unit {
    return new Unit(
      unit.entities.map((e) => {
        return new EntitySummary(
          e.entity.map((t) => new Term(t.name, t.type, t.babelNetEntity)),
          e.summary
        );
      }),
      unit.characterization
        ? new Formula(
            unit.characterization.predicates.map((p) => {
              return new Predicate(
                p.type,
                p.name,
                p.terms.map((t) => new Term(t.name, t.type, t.babelNetEntity))
              );
            })
          )
        : null,
      unit.expansion
        ? unit.expansion.map((f) => {
            return new Formula(
              f.predicates.map((p) => {
                return new Predicate(
                  p.type,
                  p.name,
                  p.terms.map((t) => new Term(t.name, t.type, t.babelNetEntity))
                );
              })
            );
          })
        : null
    );
  }
}

export class SummaryRequest {
  unit: Unit = new Unit([], new Formula([]));
  summary_config: SummaryConfig = new SummaryConfig(
    [],
    AncestorStrategy.ALL_NEAREAST,
    SummaryStrategy.NO_SUMMARY,
    OptimizationStrategy.NO_OPT,
    false,
    false
  );

  constructor(unit: Unit, summary_config: SummaryConfig) {
    this.unit = unit;
    this.summary_config = summary_config;
  }

  static fromJson(json: any) {

    if (!json.unit || !json.summary_config) {
      throw new Error("JSON is not a SummaryRequest");
    }

    return new SummaryRequest(
      Unit.fromJson(json.unit),
      SummaryConfig.fromJson(json.summary_config)
    );
  }
}

export class ListOfUnit {
  units: Unit[] = [];

  constructor(units: Unit[]) {
    this.units = units;
  }

  static fromJson(json: any) {

    if (!json.units) {
      throw new Error("JSON is not a ListOfUnit");
    }

    return new ListOfUnit(json.units.map((u: any) => Unit.fromJson(u)));
  }
}

export class Query {
  query: Formula = new Formula([]);
  exclude_both_constants: boolean = true;
  page: number = 0;

  constructor(query: Formula, exclude_both_constants: boolean, page: number) {
    this.query = query;
    this.exclude_both_constants = exclude_both_constants;
    this.page = page;
  }

  static fromJson(json: any) {

    if (!json.query || !json.exclude_both_constants || !json.page) {
      throw new Error("JSON is not a Query");
    }

    return new Query(
      Formula.fromJson(json.query),
      json.exclude_both_constants,
      json.page
    );
  }
}

export class QueryResult {
  results: Term[] = [];

  constructor(results: Term[]) {
    this.results = results;
  }

  static fromJson(json: any) {

    if (!json.results) {
      throw new Error("JSON is not a QueryResult");
    }

    return new QueryResult(json.results.map((r: any) => Term.fromJson(r)));
  }
}

export class QueryComparison {
  query1: Formula = new Formula([]);
  query2: Formula = new Formula([]);
  page: number | null = 0;

  constructor(query1: Formula, query2: Formula, page: number | null = 0) {
    this.query1 = query1;
    this.query2 = query2;
    this.page = page;
  }

  static fromJson(json: any) {

    if (!json.query1 || !json.query2) {
      throw new Error("JSON is not a QueryComparison");
    }

    return new QueryComparison(
      Formula.fromJson(json.query1),
      Formula.fromJson(json.query2),
      json.page ? json.page : null
    );
  }
}

export class SuperclassesRequest {
  term: string = "";
  superclasses: string[] = [];
  predicate: string = "";

  constructor(term: string, superclasses: string[], predicate: string) {
    this.term = term;
    this.superclasses = superclasses;
    this.predicate = predicate;
  }

  static fromJson(json: any) {

    if (!json.term || !json.superclasses || !json.predicate) {
      throw new Error("JSON is not a SuperclassesRequest");
    }

    return new SuperclassesRequest(
      json.term as string,
      json.superclasses as string[],
      json.predicate as string
    );
  }
}

export class NearestCommonAncestorsRequest {
  terms: string[] = [];
  predicate: string = "";

  constructor(terms: string[], predicate: string) {
    this.terms = terms;
    this.predicate = predicate;
  }

  static fromJson(json: any) {

    if (!json.terms || !json.predicate) {
      throw new Error("JSON is not a SuperclassesRequest");
    }

    return new NearestCommonAncestorsRequest(
      json.terms as string[],
      json.predicate as string
    );
  }
}

export class TermQuery {
  term: Term = new Term([""], TermType.CONSTANT);
  query: Formula = new Formula([]);

  constructor(term: Term, query: Formula) {
    this.term = term;
    this.query = query;
  }

  static fromJson(json: any) {

    if (!json.term || !json.query) {
      throw new Error("JSON is not a TermQuery");
    }

    return new TermQuery(
      Term.fromJson(json.term),
      Formula.fromJson(json.query)
    );
  }
}

export class BooleanAnswer {
  answer: boolean = false;

  constructor(answer: boolean) {
    this.answer = answer;
  }

  static fromJson(json: any) {

    if (!json.answer) {
      throw new Error("JSON is not a BooleanAnswer");
    }

    return new BooleanAnswer(json.answer);
  }
}

export enum UnitRelationType {
  SIM = "SIM",
  INC = "INC",
  PREC = "PREC",
  SUCC = "SUCC",
}

export class UnitRelation {
  relation: UnitRelationType = UnitRelationType.SIM;

  constructor(relation: UnitRelationType) {
    this.relation = relation;
  }

  static fromJson(json: any) {

    if (!json.relation) {
      throw new Error("JSON is not a UnitRelation");
    }

    return new UnitRelation(json.relation);
  }
}

export class User {
  id: number = 0;
  username: string = "";
  password: string | null = null;

  constructor(id: number, username: string, password: string | null) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static fromJson(json: any) {

    if (!json.id || !json.username) {
      throw new Error("JSON is not a User");
    }

    return new User(json.id, json.username, json.password);
  }
}



export class PredicateConfig {
  config: Map<string, number> = new Map<string, number>();

  constructor(config: Map<string, number>) {
    this.config = config;
  }
}

export class AdvancedPredicateConfigurator {
  predicateName: string;
  template_p: Predicate;
  left: Term;
  wholePredicate: Predicate[];
  hasBound: boolean;
  introduceBound: boolean;
  isLeftSource: boolean;
  isRightTerminal: boolean[];
  checkedRights: boolean[];
  overallStatus: 0 | 1 | 2 | 3;


  relaxationLevels: Predicate[][] = [];

  constructor(
    predicateName: string,
    template_p: Predicate,
    left: Term,
    whole: Predicate[],
    checkedRights: boolean[],
    hasBound: boolean,
    introduceBound: boolean,
    isRightTerminal: boolean[],
    overallStatus: 0 | 1 | 2 | 3,
    relaxationLevels: Predicate[][]
  ) {
    this.predicateName = predicateName;
    this.template_p = new Predicate(
      template_p.type,
      template_p.name,
      template_p.terms.map((t) => new Term(t.name, t.type))
    );
    this.template_p.terms[1].type = TermType.BOUND_VARIABLE;
    this.left = left;
    this.wholePredicate = whole;
    this.checkedRights = checkedRights;
    this.hasBound = hasBound;
    this.introduceBound = introduceBound;
    this.isLeftSource = true;
    this.isRightTerminal = isRightTerminal;
    this.overallStatus = overallStatus;
    this.relaxationLevels = relaxationLevels;
  }

  public addPredicate(_p: Predicate) {
    this.wholePredicate.push(
      new Predicate(
        _p.type,
        _p.name,
        _p.terms.map((t) => new Term(t.name, t.type, t.babelNetEntity))
        , _p.is_deriv      
      )
    );
    this.isRightTerminal.push(true);
    this.checkedRights.push(true);
  }



  public changeStatus(_no: 0 | 1 | 2 | 3) {
    this.overallStatus = _no;
    if (this.predicateName !== "HYPER") {
      if (_no == 0) {
        this.checkedRights = [] as boolean[];
        let atLeastOne = false;
        this.wholePredicate.forEach((p) => {
          this.checkedRights.push(true);
          atLeastOne = true;
        });
        this.introduceBound = this.hasBound && !atLeastOne;
      } else if (_no == 1) {
        this.checkedRights = [] as boolean[];
        this.wholePredicate.forEach((p) => {
          this.checkedRights.push(false);
        });
        this.introduceBound = true;
      } else if (_no >= 2) {

        this.checkedRights = [] as boolean[];
        this.wholePredicate.forEach((p) => {
          this.checkedRights.push(false);
        });
        this.introduceBound = false;
      }
    } else {
      this.wholePredicate = [] as Predicate[];
      this.checkedRights = [] as boolean[];
      this.relaxationLevels[_no].forEach((p) => {
        this.wholePredicate.push(
          new Predicate(
            p.type,
            p.name,
            p.terms.map((t) => new Term(t.name, t.type))
          )
        );
        this.checkedRights.push(true);
      });
      this.introduceBound = this.hasBound;
    }
  }
}
