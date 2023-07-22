# compute-api-client
A client library for accessing Compute API

## Usage
First, create a client. Since Compute requires authentication, use `AuthenticatedClient` class

```python
from compute_api_client import AuthenticatedClient

client = AuthenticatedClient(base_url="http://compute-api:8000", token="SuperSecretToken")
```

Now we call Compute and get the list of Plugins:

```python
from compute_api_client.models import Plugin
from compute_api_client.api.plugin_controller import plugin_controller_find
from compute_api_client.types import Response

response: Response[MyDataModel] = get_my_data_model.sync_detailed(client=client)
```

Or do the same thing with an async version:

```python
from compute_api_client.models import Plugin
from compute_api_client.api.plugin_controller import plugin_controller_find
from compute_api_client.types import Response

response: Response[MyDataModel] = await get_my_data_model.sync_detailed(client=client)
```

There are more settings on the generated `Client` class which let you control more runtime behavior, check out the docstring on that class for more info.

Things to know:
1. Every path/method combo becomes a Python module with four functions:
    1. `sync`: Blocking request that returns parsed data (if successful) or `None`
    1. `sync_detailed`: Blocking request that always returns a `Request`, optionally with `parsed` set if the request was successful.
    1. `asyncio`: Like `sync` but async instead of blocking
    1. `asyncio_detailed`: Like `sync_detailed` but async instead of blocking

1. All path/query params, and bodies become method arguments.
1. If your endpoint had any tags on it, the first tag will be used as a module name for the function (my_tag above)
1. Any endpoint which did not have a tag will be in `compute_api_client.api.default`

## Building / publishing this Client
This project uses [Poetry](https://python-poetry.org/) to manage dependencies  and packaging.  Here are the basics:
1. Update the metadata in pyproject.toml (e.g. authors, version)
1. If you're using a private repository, configure it with Poetry
    1. `poetry config repositories.<your-repository-name> <url-to-your-repository>`
    1. `poetry config http-basic.<your-repository-name> <username> <password>`
1. Publish the client with `poetry publish --build -r <your-repository-name>` or, if for public PyPI, just `poetry publish --build`

If you want to install this client into another project without publishing it (e.g. for development) then:
1. If that project **is using Poetry**, you can simply do `poetry add <path-to-this-client>` from that project
1. If that project is not using Poetry:
    1. Build a wheel with `poetry build -f wheel`
    1. Install that wheel from the other project `pip install <path-to-wheel>`
