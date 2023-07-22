from typing import Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

T = TypeVar("T", bound="PluginFilterFieldsType0")


@attr.s(auto_attribs=True)
class PluginFilterFieldsType0:
    """
    Attributes:
        id (Union[Unset, bool]):
        cwl_id (Union[Unset, bool]):
        name (Union[Unset, bool]):
        version (Union[Unset, bool]):
        title (Union[Unset, bool]):
        description (Union[Unset, bool]):
        container_id (Union[Unset, bool]):
        inputs (Union[Unset, bool]):
        outputs (Union[Unset, bool]):
        custom_inputs (Union[Unset, bool]):
        ui (Union[Unset, bool]):
        author (Union[Unset, bool]):
        institution (Union[Unset, bool]):
        website (Union[Unset, bool]):
        citation (Union[Unset, bool]):
        repository (Union[Unset, bool]):
        base_command (Union[Unset, bool]):
        stdout (Union[Unset, bool]):
        stderr (Union[Unset, bool]):
        plugin_hardware_requirements (Union[Unset, bool]):
        cwl_script (Union[Unset, bool]):
    """

    id: Union[Unset, bool] = UNSET
    cwl_id: Union[Unset, bool] = UNSET
    name: Union[Unset, bool] = UNSET
    version: Union[Unset, bool] = UNSET
    title: Union[Unset, bool] = UNSET
    description: Union[Unset, bool] = UNSET
    container_id: Union[Unset, bool] = UNSET
    inputs: Union[Unset, bool] = UNSET
    outputs: Union[Unset, bool] = UNSET
    custom_inputs: Union[Unset, bool] = UNSET
    ui: Union[Unset, bool] = UNSET
    author: Union[Unset, bool] = UNSET
    institution: Union[Unset, bool] = UNSET
    website: Union[Unset, bool] = UNSET
    citation: Union[Unset, bool] = UNSET
    repository: Union[Unset, bool] = UNSET
    base_command: Union[Unset, bool] = UNSET
    stdout: Union[Unset, bool] = UNSET
    stderr: Union[Unset, bool] = UNSET
    plugin_hardware_requirements: Union[Unset, bool] = UNSET
    cwl_script: Union[Unset, bool] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        cwl_id = self.cwl_id
        name = self.name
        version = self.version
        title = self.title
        description = self.description
        container_id = self.container_id
        inputs = self.inputs
        outputs = self.outputs
        custom_inputs = self.custom_inputs
        ui = self.ui
        author = self.author
        institution = self.institution
        website = self.website
        citation = self.citation
        repository = self.repository
        base_command = self.base_command
        stdout = self.stdout
        stderr = self.stderr
        plugin_hardware_requirements = self.plugin_hardware_requirements
        cwl_script = self.cwl_script

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if id is not UNSET:
            field_dict["id"] = id
        if cwl_id is not UNSET:
            field_dict["cwlId"] = cwl_id
        if name is not UNSET:
            field_dict["name"] = name
        if version is not UNSET:
            field_dict["version"] = version
        if title is not UNSET:
            field_dict["title"] = title
        if description is not UNSET:
            field_dict["description"] = description
        if container_id is not UNSET:
            field_dict["containerId"] = container_id
        if inputs is not UNSET:
            field_dict["inputs"] = inputs
        if outputs is not UNSET:
            field_dict["outputs"] = outputs
        if custom_inputs is not UNSET:
            field_dict["customInputs"] = custom_inputs
        if ui is not UNSET:
            field_dict["ui"] = ui
        if author is not UNSET:
            field_dict["author"] = author
        if institution is not UNSET:
            field_dict["institution"] = institution
        if website is not UNSET:
            field_dict["website"] = website
        if citation is not UNSET:
            field_dict["citation"] = citation
        if repository is not UNSET:
            field_dict["repository"] = repository
        if base_command is not UNSET:
            field_dict["baseCommand"] = base_command
        if stdout is not UNSET:
            field_dict["stdout"] = stdout
        if stderr is not UNSET:
            field_dict["stderr"] = stderr
        if plugin_hardware_requirements is not UNSET:
            field_dict["pluginHardwareRequirements"] = plugin_hardware_requirements
        if cwl_script is not UNSET:
            field_dict["cwlScript"] = cwl_script

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        d = src_dict.copy()
        id = d.pop("id", UNSET)

        cwl_id = d.pop("cwlId", UNSET)

        name = d.pop("name", UNSET)

        version = d.pop("version", UNSET)

        title = d.pop("title", UNSET)

        description = d.pop("description", UNSET)

        container_id = d.pop("containerId", UNSET)

        inputs = d.pop("inputs", UNSET)

        outputs = d.pop("outputs", UNSET)

        custom_inputs = d.pop("customInputs", UNSET)

        ui = d.pop("ui", UNSET)

        author = d.pop("author", UNSET)

        institution = d.pop("institution", UNSET)

        website = d.pop("website", UNSET)

        citation = d.pop("citation", UNSET)

        repository = d.pop("repository", UNSET)

        base_command = d.pop("baseCommand", UNSET)

        stdout = d.pop("stdout", UNSET)

        stderr = d.pop("stderr", UNSET)

        plugin_hardware_requirements = d.pop("pluginHardwareRequirements", UNSET)

        cwl_script = d.pop("cwlScript", UNSET)

        plugin_filter_fields_type_0 = cls(
            id=id,
            cwl_id=cwl_id,
            name=name,
            version=version,
            title=title,
            description=description,
            container_id=container_id,
            inputs=inputs,
            outputs=outputs,
            custom_inputs=custom_inputs,
            ui=ui,
            author=author,
            institution=institution,
            website=website,
            citation=citation,
            repository=repository,
            base_command=base_command,
            stdout=stdout,
            stderr=stderr,
            plugin_hardware_requirements=plugin_hardware_requirements,
            cwl_script=cwl_script,
        )

        plugin_filter_fields_type_0.additional_properties = d
        return plugin_filter_fields_type_0

    @property
    def additional_keys(self) -> List[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
