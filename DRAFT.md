# DRAFT.md

POST /auth/signup
POST /auth/signdown? 너무 억지임? ㅋㅋ

POST /auth/signin
POST /auth/signout

POST /api/v1/auth/token
POST /api/v1/auth/refresh

user: {
    id: number,
    email: string,
    password: string,
    
}

## References
- http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
- https://velog.io/@hopsprings2/%EA%B2%AC%EA%B3%A0%ED%95%9C-node.js-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90-%EC%84%A4%EA%B3%84%ED%95%98%EA%B8%B0