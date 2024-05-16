const BASE_URL: string = "http://localhost:8080";
import {
  BooleanAnswer,
  ListOfUnit,
  Query,
  QueryComparison,
  QueryResult,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermQuery,
  User,
  Unit,
  UnitRelation,
  SuperclassesRequest,
  NearestCommonAncestorsRequest,
  Predicate,
} from "../models/models";

export enum Endpoints {
  PROVA = "/prova",
  INDEX = "/index",
  SEARCH_BY_ID = "/api/search/id/",
  SEARCH_BY_ID_BATCHED = "/api/search/batched/",
  SEARCH_BY_LEMMA = "/api/search/",
  SUMMARY_CONFIG = "/api/summary/config/",
  SUMMARY = "/api/summary/",
  CHARACTERIZE = "/api/characterize/",
  COMPARE = "/api/compare/",
  EXPAND = "/api/expand/",
  QUERY = "/api/query",
  QUERY_DIFF = "/api/query/diff",
  QUERY_TERM = "/api/query/term",
  QUERY_SUBSET = "/api/query/subset",
  SUPERCLASSES = "/api/query/superclass/get/",
  CHECK_SUPERCLASSES = "/api/query/superclass/check",
  NEAREST_COMMON_ANCESTORS = "/api/summary/ancestors",
  REGISTER = "/api/register",
  LOGIN = "/api/login",
  PROVA_PROTECTED = "/api/protected",
  TRANSITIVE_RELAXER = "/api/relax/transitive"
}


export async function fetchProva(): Promise<string | number> {
  const response = await fetch(BASE_URL + Endpoints.PROVA, {
    method: "GET",
  });
  if (!response.ok) {
    return response.status;
  }
  return await response.text();
}

export async function callSearchById(
  bn_id: string,
  token: string
): Promise<Term | number> {
  const response = await fetch(BASE_URL + Endpoints.SEARCH_BY_ID + bn_id, {
    method: "GET",
    headers: {
      "Authorization": token,
    },
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return Term.fromJson(result);
    })
    .catch((error) => {
      return response.status;
    });
}

export async function callSearchByIdBatched(
  terms: string[],
  token: string
): Promise<Term[] | number> {
  const response = await fetch(
    BASE_URL + Endpoints.SEARCH_BY_ID_BATCHED,
    {
      method: "POST",
      headers: {
        "Authorization": token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(terms)
    }
  );
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return result.map((item: any) => Term.fromJson(item));
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callSearchByLemma(
  lemma: string,
  page: number,
  token: string
): Promise<Term[] | number> {
  const response = await fetch(
    BASE_URL + Endpoints.SEARCH_BY_LEMMA + lemma + "/" + page,
    {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    }
  );
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return result.map((item: any) => Term.fromJson(item));
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}


export async function callSummaryConfig(
  unit: Unit,
  token: string
): Promise<SummaryConfig | number> {
  const response = await fetch(BASE_URL + Endpoints.SUMMARY_CONFIG, {
    method: "POST",
    headers: { 
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(unit, (k, v) => v ?? undefined)
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return SummaryConfig.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callSummary(
  summaryRequest: SummaryRequest,
  token: string
): Promise<Unit | number> {
  const response = await fetch(BASE_URL + Endpoints.SUMMARY, {
    method: "POST",
    headers: { 
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(summaryRequest, (k, v) => v ?? undefined)
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return Unit.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callCharacterize(
  unit: Unit,
  token: string
): Promise<Unit | number> {
  const response = await fetch(BASE_URL + Endpoints.CHARACTERIZE, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(unit, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return Unit.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callCompare(
  ListOfUnit: ListOfUnit,
  token: string
): Promise<UnitRelation | number> {
  const response = await fetch(BASE_URL + Endpoints.COMPARE, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ListOfUnit, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return UnitRelation.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callExpand(
  unit: Unit,
  token: string
): Promise<Unit | number> {
  const response = await fetch(BASE_URL + Endpoints.EXPAND, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(unit, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return Unit.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callQuery(
  q: Query,
  token: string
): Promise<QueryResult | number> {
  const response = await fetch(BASE_URL + Endpoints.QUERY, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return QueryResult.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callQueryDiff(
  q: QueryComparison,
  token: string
): Promise<QueryResult | number> {
  const response = await fetch(BASE_URL + Endpoints.QUERY_DIFF, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return QueryResult.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callQueryTerm(
  q: TermQuery,
  token: string
): Promise<boolean | number> {
  const response = await fetch(BASE_URL + Endpoints.QUERY_TERM, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return BooleanAnswer.fromJson(result).answer;
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callQuerySubset(
  q: QueryComparison,
  token: string
): Promise<boolean | number> {
  const response = await fetch(BASE_URL + Endpoints.QUERY_SUBSET, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return BooleanAnswer.fromJson(result).answer;
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callGetSuperclasses(
  bn_id: string,
  token: string
): Promise<Term[] | number> {
  const response = await fetch(BASE_URL + Endpoints.SUPERCLASSES + bn_id, {
    method: "GET",
    headers: {
      "Authorization": token,
    },
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return result.map((item: any) => Term.fromJson(item));
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callCheckSuperclasses(
  sr: SuperclassesRequest,
  token: string
): Promise<string[] | number> {
  const response = await fetch(BASE_URL + Endpoints.CHECK_SUPERCLASSES, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sr, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return result as string[];
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

export async function callNearestCommonAncestors(
  nr: NearestCommonAncestorsRequest,
  token: string
): Promise<Term[] | number> {
  const response = await fetch(BASE_URL + Endpoints.NEAREST_COMMON_ANCESTORS, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nr, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return result.map((item: any) => Term.fromJson(item));
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}


export async function callTransitiveRelaxer(request: Predicate[], token: string): Promise<Predicate[][] | number> {
  const body = {
    'atoms' : request
    
  }
  const response = await fetch(BASE_URL + Endpoints.TRANSITIVE_RELAXER, {
    
    method: "POST",
    headers : {
      "Authorization": token,
      "Content-Type": 'application/json'
    },
    body : JSON.stringify(body, (k, v) => v ?? undefined)
  });
  if (!response.ok) {
    return response.status;
  }

  return await response.json().then((result: {'levels': []}) => {
    return Predicate.fromArrays(result.levels ? result.levels : undefined);
  })

}

export async function callRegister(u: User): Promise<boolean | number> {
  const response = await fetch(BASE_URL + Endpoints.REGISTER, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(u, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return BooleanAnswer.fromJson(result).answer;
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

// returns the token :)
export async function callLogin(u: User): Promise<string | number> {
  const response = await fetch(BASE_URL + Endpoints.LOGIN, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(u, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return response.headers.get("Authorization") as string;
}

export async function fetchProvaProtected(
  u: User,
  token: string
): Promise<User | number> {
  const response = await fetch(BASE_URL + Endpoints.PROVA_PROTECTED, {
    method: "POST",
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(u, (k, v) => v ?? undefined),
  });
  if (!response.ok) {
    return response.status;
  }
  return await response
    .json()
    .then((result) => {
      return User.fromJson(result);
    })
    .catch((error) => {
      throw new Error(`Network response was not ok ${error}`);
    });
}

// nell header della richiesta da fetchare, quindi va aggiunto come parametro opzionale
// in tutti i metodi sopra (ma questo lo facciamo più avanti, che se no ci usciamo pazzi in fase di test)
