# docker-decap-cms-standalone

> **Note**
> Formerly `docker-netlify-cms-standalone`. In early 2023 Netlify CMS was rebranded to Decap CMS under new ownership ([see post](https://www.netlify.com/blog/netlify-cms-to-become-decap-cms/)).

<br />


**Easy-to-use Docker image to self-host Decap CMS (without using Netlify).**


Includes [Decap CMS](https://github.com/decaporg/decap-cms) + [an external authentication provider](https://github.com/vencax/netlify-cms-github-oauth-provider) to allow auth with Github/Gitlab.

_Why use Decap CMS?_
Decap CMS is a headless CMS that presents a clean UI for editing content (e.g. markdown files) stored in a Git repository. Easy to configure with a YAML config file - a simple and flexible way to add content to any site built with a static site generator.

[View on Docker Hub 🐳](https://hub.docker.com/r/itsmejoeeey/docker-netlify-cms-standalone)

---

## Getting started

You will need Docker installed on your system

### To get started using Github.com

```
docker run -d \
  -p 80:80 \
  -e ORIGIN='<your root url>' \
  -e OAUTH_CLIENT_ID='<your_github_client_id>' \
  -e OAUTH_CLIENT_SECRET='<your_github_client_secret>' \
  -v ./my-local-conf.yml:/app/config.yml:ro \
  --name decap-cms \
  --restart=always \
  itsmejoeeey/docker-netlify-cms-standalone:latest
```

See also: ["Supplying a valid `config.yml` file"](#supplying-a-valid-configyml-file)

Environment variables:
* `ORIGIN`: the root url Decap CMS will be accessible from (i.e. `https://cms.example.com`). Can contain regex (e.g. `.*.example.com`).
* `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`: need to provide from Github (see below).
Additionally:
* `GIT_HOSTNAME`: for enterprise Github installations.

#### Getting `OAUTH_CLIENT_ID` and `OUTH_CLIENT_SECRET`

1. Visit Github and go to `Settings > Developer settings > OAuth Apps`
2. Create a 'New OAuth App' with:
    `Homepage URL` = your `{ORIGIN}` above (i.e. `https://cms.example.com`)
    `Authorization callback URL` = `{ORIGIN}/callback` (i.e. `https://cms.example.com/callback`)


### To get starting using Gitlab.com

```
docker run -d \
  -p 80:80 \
  -e ORIGIN='<your root url>' \
  -e OAUTH_CLIENT_ID='<your_gitlab_client_id>' \
  -e OAUTH_CLIENT_SECRET='<your_gitlab_client_secret>' \
  -e GIT_HOSTNAME='https://gitlab.com' \
  -e OAUTH_PROVIDER='gitlab' \
  -e SCOPES='api' \
  -e OAUTH_AUTHORIZE_PATH='/oauth/authorize' \
  -e OAUTH_TOKEN_PATH='/oauth/token' \
  -v ./my-local-conf.yml:/app/config.yml:ro \
  --name decap-cms \
  --restart=always \
  itsmejoeeey/docker-netlify-cms-standalone:latest
```

See also: ["Supplying a valid `config.yml` file"](#supplying-a-valid-configyml-file)

Environment variables:
* `ORIGIN`: the root url Decap CMS will be accessible from (i.e. `https://cms.example.com`). Can contain regex (e.g. `.*.example.com`).
* `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`: need to provide from Gitlab ([see further instruction here](https://docs.gitlab.com/ee/integration/oauth_provider.html)).
* `OAUTH_PROVIDER`, `SCOPES`, `OAUTH_AUTHORIZE_PATH`, `OAUTH_TOKEN_PATH`: don't need to be changed.
Additionally:
* `GIT_HOSTNAME`: for enterprise Gitlab installations.

TODO: Elaborate more. [See here for more information.](https://github.com/vencax/netlify-cms-github-oauth-provider#auth-provider-config)


### Supplying a valid `config.yml` file

[See the example file stored in the repo here.](https://github.com/itsmejoeeey/docker-decap-cms-standalone/blob/master/app/config.yml)

- Make sure to update `name`, `repo`, and `branch` to match your backend provider.
    i.e.:
    ```
        name: [github|gitlab]
        repo: itsmejoeeey/test-blog-content
        branch: main
    ```

- Make sure to update `base_url` to match the `ORIGIN` environment variable you passed initially.
    i.e.:
    ```
        base_url: https://cms.example.com
    ```

