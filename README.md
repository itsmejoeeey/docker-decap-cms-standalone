# staticjscms-hugo-standalone

> This is a fork of https://github.com/itsmejoeeey/docker-decap-cms-standalone which uses the Static CMS fork of Decap CMS, with settings and layout optimized for a Hugo documentation site.

<br />


**Easy-to-use Docker image to self-host Static CMS (without using Netlify).**

Includes [Static CMS](https://github.com/StaticJsCMS/static-cms) + [an external authentication provider](https://github.com/vencax/netlify-cms-github-oauth-provider) to allow auth with Github/Gitlab.

---

## Getting started

You will need Docker installed on your system

### To get started using Github.com

```
docker run -d \
  -p 80:80 \
  -e ORIGINS='<your root url>' \
  -e OAUTH_CLIENT_ID='<your_github_client_id>' \
  -e OAUTH_CLIENT_SECRET='<your_github_client_secret>' \
  -v ./my-local-conf.yml:/app/config.yml:ro \
  --name static-cms \
  --restart=always \
  giantswarm/static-cms-standalone:latest
```

See also: ["Supplying a valid `config.yml` file"](#supplying-a-valid-configyml-file)

Environment variables:
* `ORIGINS`: the root url Decap CMS will be accessible from (i.e. `https://cms.example.com`). Can contain more than one (comma-separated). Can contain regex (e.g. `.*.example.com`).
* `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`: need to provide from Github (see below).
Additionally:
* `GIT_HOSTNAME`: for enterprise Github installations.

#### Getting `OAUTH_CLIENT_ID` and `OUTH_CLIENT_SECRET`

1. Visit Github and go to `Settings > Developer settings > OAuth Apps`
2. Create a 'New OAuth App' with:
    `Homepage URL` = your origin(s) above (i.e. `https://cms.example.com`)
    `Authorization callback URL` = `{origin}/callback` (i.e. `https://cms.example.com/callback`)


### To get starting using Gitlab.com

```
docker run -d \
  -p 80:80 \
  -e ORIGINS='<your root url>' \
  -e OAUTH_CLIENT_ID='<your_gitlab_client_id>' \
  -e OAUTH_CLIENT_SECRET='<your_gitlab_client_secret>' \
  -e GIT_HOSTNAME='https://gitlab.com' \
  -e OAUTH_PROVIDER='gitlab' \
  -e SCOPES='api' \
  -e OAUTH_AUTHORIZE_PATH='/oauth/authorize' \
  -e OAUTH_TOKEN_PATH='/oauth/token' \
  -v ./my-local-conf.yml:/app/config.yml:ro \
  --name static-cms \
  --restart=always \
  giantswarm/static-cms-standalone:latest
```

See also: ["Supplying a valid `config.yml` file"](#supplying-a-valid-configyml-file)

Environment variables:
* `ORIGINS`: the root url Decap CMS will be accessible from (i.e. `https://cms.example.com`). Can contain more than one (comma-separated). Can contain regex (e.g. `.*.example.com`).
* `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`: need to provide from Gitlab ([see further instruction here](https://docs.gitlab.com/ee/integration/oauth_provider.html)).
* `OAUTH_PROVIDER`, `SCOPES`, `OAUTH_AUTHORIZE_PATH`, `OAUTH_TOKEN_PATH`: don't need to be changed.
Additionally:
* `GIT_HOSTNAME`: for enterprise Gitlab installations.

- Make sure to update `base_url` to match the origin(s) you passed initially.
  i.e.:
    ```
        base_url: https://cms.example.com
    ```

### Custom Static CMS Build

To run your own static-cms build, either start the image with the following mount options (pointing to `static-cms/app` distributables):

```
${PWD}/../static-cms/packages/app:/app/staticcms/app
```

or set the Git submodule at static-cms to the right repository and commit.
