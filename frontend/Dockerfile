FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else npm ci || npm i; fi

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

