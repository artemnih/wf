# Changelog

## 1.0.0 (2024-09-14)


### Features

* create all paths requested by the workflow ([d788c29](https://github.com/PolusAI/compute/commit/d788c29a890d687c4008072644d9993f8bfee94d))
* debug and modified argodriver workflow generation code. ([d656129](https://github.com/PolusAI/compute/commit/d656129b5cbfe58d630c45ae5e327bec27748b34))


### Bug Fixes

* cwl names are invalid argo names so transform them. ([6c11c08](https://github.com/PolusAI/compute/commit/6c11c081ee1e6c2dbba8c121882eef7500c93444))
* fixed unit tests ([43a0e5e](https://github.com/PolusAI/compute/commit/43a0e5e1837032884d8efd86379dc2c0bb1198bb))
* improve typing. ([805bdbb](https://github.com/PolusAI/compute/commit/805bdbb85ed602032f605ea2f13f8f40d9e1e533))
* input and output directories are mounted with correct permissions. ([a3c12d9](https://github.com/PolusAI/compute/commit/a3c12d90c37ade29034ecd58fba3df71a4bb1636))
* multiple steps workflow executes successfully. ([b328513](https://github.com/PolusAI/compute/commit/b32851312da777fbc322ade66610d84530923873))
* path or location attribute can be used in  paths ([45f0624](https://github.com/PolusAI/compute/commit/45f0624690237f13cbc5f77e0e707a88bc48d6a2))
* step output with source attribute are handled correctly. ([1a6a53b](https://github.com/PolusAI/compute/commit/1a6a53b445129d68bb2fe9c4464ec00e21d6ae5a))
* transform cwl names into valid  argo names. ([6c11c08](https://github.com/PolusAI/compute/commit/6c11c081ee1e6c2dbba8c121882eef7500c93444))
* transform cwl names into valid argo names. ([6c11c08](https://github.com/PolusAI/compute/commit/6c11c081ee1e6c2dbba8c121882eef7500c93444))

## Version 0.2.0

Comprehensive rewrite of the Argo-driver.

-   fix: remove many restrictions on cwl
-   fix: support for wic generated cwl
-   fix: build valid argo workflows from cwl
-   fix: multistep cwl workflows are handled properly
-   fix: cwl workflow paths are correctly mounted into containers
-   fix: multiple other bugs and mishandled cases
-   remove: scatter functionality is temporarily removed
    until some specifications are made available.

NOTE : unit tests have not been updated.

## Version 0.1.1

Original version
