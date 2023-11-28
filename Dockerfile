#
# Prebuild Stage
#
FROM node:18-alpine AS prebuild

# Package versions
ARG DECAP_CMS_VER=3.0.9
ARG NETLIFY_CMS_AUTH_HASH=1155d1964d9a1f8d0d916dc0836c127526d24c49

# Install git
RUN apk add --update git && rm  -rf /tmp/* /var/cache/apk/*

# Create builder directory
WORKDIR /builder

# Download `decap-cms` from NPM
# > We do this so we can pull only the `dist` files into the `main` stage.
#   Many unneeded dependencies are included if we install this NPM package in `/app/decap-cms`
RUN npm pack decap-cms@${DECAP_CMS_VER} && \
    mkdir -p /builder/decap-cms && \
    tar -xzvf decap-cms-${DECAP_CMS_VER}.tgz -C decap-cms

# Clone `netlify-cms-github-oauth-provider`
RUN git clone https://github.com/vencax/netlify-cms-github-oauth-provider.git /builder/netlify-cms-github-oauth-provider && \
    cd /builder/netlify-cms-github-oauth-provider && \
    git reset --hard ${NETLIFY_CMS_AUTH_HASH}
# Temporary fix - apply all custom patches to `netlify-cms-github-oauth-provider`
COPY app/netlify-cms-github-oauth-provider/*.patch /builder/netlify-cms-github-oauth-provider/
RUN cd /builder/netlify-cms-github-oauth-provider && \
    git apply *.patch && \
    rm *.patch



#
# Main stage
#
FROM node:18-alpine AS main

# Environment vars
ENV LOGLEVEL=info
ENV ORIGINS=http://localhost
#
ENV GIT_HOSTNAME=
ENV OAUTH_CLIENT_ID=
ENV OAUTH_CLIENT_SECRET=
#
ENV OAUTH_PROVIDER=
ENV SCOPES=
ENV OAUTH_AUTHORIZE_PATH=
ENV OAUTH_TOKEN_PATH=

# Create app directory
WORKDIR /app
# Bundle app source
COPY app .

# Bundle prebuild files
COPY --from=prebuild /builder/decap-cms/package/dist ./decap-cms/dist
COPY --from=prebuild /builder/netlify-cms-github-oauth-provider ./netlify-cms-github-oauth-provider

# Install production packages
RUN cd /app/decap-cms && yarn install --production=true
RUN cd /app/netlify-cms-github-oauth-provider && yarn install --production=true

WORKDIR /app/decap-cms
ENV NODE_ENV production
EXPOSE 80
ENTRYPOINT ["node", "./app.js" ]
