from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union, cast

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.new_scripts_cwl_script import NewScriptsCwlScript
    from ..models.new_scripts_inputs_item import NewScriptsInputsItem
    from ..models.new_scripts_outputs_item import NewScriptsOutputsItem
    from ..models.new_scripts_plugin_hardware_requirements import NewScriptsPluginHardwareRequirements
    from ..models.new_scripts_ui_item import NewScriptsUiItem


T = TypeVar("T", bound="NewScripts")


@attr.s(auto_attribs=True)
class NewScripts:
    """(tsType: Omit<Plugin, 'id'>, schemaOptions: { title: 'NewScripts', exclude: [ 'id' ] })

    Attributes:
        version (str):
        cwl_id (Union[Unset, str]):
        name (Union[Unset, str]):
        title (Union[Unset, str]):
        description (Union[Unset, str]):
        container_id (Union[Unset, str]):
        inputs (Union[Unset, List['NewScriptsInputsItem']]):
        outputs (Union[Unset, List['NewScriptsOutputsItem']]):
        custom_inputs (Union[Unset, bool]):
        ui (Union[Unset, List['NewScriptsUiItem']]):
        author (Union[Unset, str]):
        institution (Union[Unset, str]):
        website (Union[Unset, str]):
        citation (Union[Unset, str]):
        repository (Union[Unset, str]):
        base_command (Union[Unset, List[str]]):
        stdout (Union[Unset, str]):
        stderr (Union[Unset, str]):
        plugin_hardware_requirements (Union[Unset, NewScriptsPluginHardwareRequirements]):
        cwl_script (Union[Unset, NewScriptsCwlScript]):
    """

    version: str
    cwl_id: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    title: Union[Unset, str] = UNSET
    description: Union[Unset, str] = UNSET
    container_id: Union[Unset, str] = UNSET
    inputs: Union[Unset, List["NewScriptsInputsItem"]] = UNSET
    outputs: Union[Unset, List["NewScriptsOutputsItem"]] = UNSET
    custom_inputs: Union[Unset, bool] = UNSET
    ui: Union[Unset, List["NewScriptsUiItem"]] = UNSET
    author: Union[Unset, str] = UNSET
    institution: Union[Unset, str] = UNSET
    website: Union[Unset, str] = UNSET
    citation: Union[Unset, str] = UNSET
    repository: Union[Unset, str] = UNSET
    base_command: Union[Unset, List[str]] = UNSET
    stdout: Union[Unset, str] = UNSET
    stderr: Union[Unset, str] = UNSET
    plugin_hardware_requirements: Union[Unset, "NewScriptsPluginHardwareRequirements"] = UNSET
    cwl_script: Union[Unset, "NewScriptsCwlScript"] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        version = self.version
        cwl_id = self.cwl_id
        name = self.name
        title = self.title
        description = self.description
        container_id = self.container_id
        inputs: Union[Unset, List[Dict[str, Any]]] = UNSET
        if not isinstance(self.inputs, Unset):
            inputs = []
            for inputs_item_data in self.inputs:
                inputs_item = inputs_item_data.to_dict()

                inputs.append(inputs_item)

        outputs: Union[Unset, List[Dict[str, Any]]] = UNSET
        if not isinstance(self.outputs, Unset):
            outputs = []
            for outputs_item_data in self.outputs:
                outputs_item = outputs_item_data.to_dict()

                outputs.append(outputs_item)

        custom_inputs = self.custom_inputs
        ui: Union[Unset, List[Dict[str, Any]]] = UNSET
        if not isinstance(self.ui, Unset):
            ui = []
            for ui_item_data in self.ui:
                ui_item = ui_item_data.to_dict()

                ui.append(ui_item)

        author = self.author
        institution = self.institution
        website = self.website
        citation = self.citation
        repository = self.repository
        base_command: Union[Unset, List[str]] = UNSET
        if not isinstance(self.base_command, Unset):
            base_command = self.base_command

        stdout = self.stdout
        stderr = self.stderr
        plugin_hardware_requirements: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.plugin_hardware_requirements, Unset):
            plugin_hardware_requirements = self.plugin_hardware_requirements.to_dict()

        cwl_script: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.cwl_script, Unset):
            cwl_script = self.cwl_script.to_dict()

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "version": version,
            }
        )
        if cwl_id is not UNSET:
            field_dict["cwlId"] = cwl_id
        if name is not UNSET:
            field_dict["name"] = name
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
        from ..models.new_scripts_cwl_script import NewScriptsCwlScript
        from ..models.new_scripts_inputs_item import NewScriptsInputsItem
        from ..models.new_scripts_outputs_item import NewScriptsOutputsItem
        from ..models.new_scripts_plugin_hardware_requirements import NewScriptsPluginHardwareRequirements
        from ..models.new_scripts_ui_item import NewScriptsUiItem

        d = src_dict.copy()
        version = d.pop("version")

        cwl_id = d.pop("cwlId", UNSET)

        name = d.pop("name", UNSET)

        title = d.pop("title", UNSET)

        description = d.pop("description", UNSET)

        container_id = d.pop("containerId", UNSET)

        inputs = []
        _inputs = d.pop("inputs", UNSET)
        for inputs_item_data in _inputs or []:
            inputs_item = NewScriptsInputsItem.from_dict(inputs_item_data)

            inputs.append(inputs_item)

        outputs = []
        _outputs = d.pop("outputs", UNSET)
        for outputs_item_data in _outputs or []:
            outputs_item = NewScriptsOutputsItem.from_dict(outputs_item_data)

            outputs.append(outputs_item)

        custom_inputs = d.pop("customInputs", UNSET)

        ui = []
        _ui = d.pop("ui", UNSET)
        for ui_item_data in _ui or []:
            ui_item = NewScriptsUiItem.from_dict(ui_item_data)

            ui.append(ui_item)

        author = d.pop("author", UNSET)

        institution = d.pop("institution", UNSET)

        website = d.pop("website", UNSET)

        citation = d.pop("citation", UNSET)

        repository = d.pop("repository", UNSET)

        base_command = cast(List[str], d.pop("baseCommand", UNSET))

        stdout = d.pop("stdout", UNSET)

        stderr = d.pop("stderr", UNSET)

        _plugin_hardware_requirements = d.pop("pluginHardwareRequirements", UNSET)
        plugin_hardware_requirements: Union[Unset, NewScriptsPluginHardwareRequirements]
        if isinstance(_plugin_hardware_requirements, Unset):
            plugin_hardware_requirements = UNSET
        else:
            plugin_hardware_requirements = NewScriptsPluginHardwareRequirements.from_dict(_plugin_hardware_requirements)

        _cwl_script = d.pop("cwlScript", UNSET)
        cwl_script: Union[Unset, NewScriptsCwlScript]
        if isinstance(_cwl_script, Unset):
            cwl_script = UNSET
        else:
            cwl_script = NewScriptsCwlScript.from_dict(_cwl_script)

        new_scripts = cls(
            version=version,
            cwl_id=cwl_id,
            name=name,
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

        new_scripts.additional_properties = d
        return new_scripts

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
