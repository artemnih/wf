from typing import Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

T = TypeVar("T", bound="JobFilterFieldsType0")


@attr.s(auto_attribs=True)
class JobFilterFieldsType0:
    """
    Attributes:
        id (Union[Unset, bool]):
        workflow_id (Union[Unset, bool]):
        driver (Union[Unset, bool]):
        step_name (Union[Unset, bool]):
        script_path (Union[Unset, bool]):
        command_line_tool (Union[Unset, bool]):
        inputs (Union[Unset, bool]):
        outputs (Union[Unset, bool]):
        status (Union[Unset, bool]):
        date_created (Union[Unset, bool]):
        date_finished (Union[Unset, bool]):
        owner (Union[Unset, bool]):
    """

    id: Union[Unset, bool] = UNSET
    workflow_id: Union[Unset, bool] = UNSET
    driver: Union[Unset, bool] = UNSET
    step_name: Union[Unset, bool] = UNSET
    script_path: Union[Unset, bool] = UNSET
    command_line_tool: Union[Unset, bool] = UNSET
    inputs: Union[Unset, bool] = UNSET
    outputs: Union[Unset, bool] = UNSET
    status: Union[Unset, bool] = UNSET
    date_created: Union[Unset, bool] = UNSET
    date_finished: Union[Unset, bool] = UNSET
    owner: Union[Unset, bool] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        workflow_id = self.workflow_id
        driver = self.driver
        step_name = self.step_name
        script_path = self.script_path
        command_line_tool = self.command_line_tool
        inputs = self.inputs
        outputs = self.outputs
        status = self.status
        date_created = self.date_created
        date_finished = self.date_finished
        owner = self.owner

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if id is not UNSET:
            field_dict["id"] = id
        if workflow_id is not UNSET:
            field_dict["workflowId"] = workflow_id
        if driver is not UNSET:
            field_dict["driver"] = driver
        if step_name is not UNSET:
            field_dict["stepName"] = step_name
        if script_path is not UNSET:
            field_dict["scriptPath"] = script_path
        if command_line_tool is not UNSET:
            field_dict["commandLineTool"] = command_line_tool
        if inputs is not UNSET:
            field_dict["inputs"] = inputs
        if outputs is not UNSET:
            field_dict["outputs"] = outputs
        if status is not UNSET:
            field_dict["status"] = status
        if date_created is not UNSET:
            field_dict["dateCreated"] = date_created
        if date_finished is not UNSET:
            field_dict["dateFinished"] = date_finished
        if owner is not UNSET:
            field_dict["owner"] = owner

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        d = src_dict.copy()
        id = d.pop("id", UNSET)

        workflow_id = d.pop("workflowId", UNSET)

        driver = d.pop("driver", UNSET)

        step_name = d.pop("stepName", UNSET)

        script_path = d.pop("scriptPath", UNSET)

        command_line_tool = d.pop("commandLineTool", UNSET)

        inputs = d.pop("inputs", UNSET)

        outputs = d.pop("outputs", UNSET)

        status = d.pop("status", UNSET)

        date_created = d.pop("dateCreated", UNSET)

        date_finished = d.pop("dateFinished", UNSET)

        owner = d.pop("owner", UNSET)

        job_filter_fields_type_0 = cls(
            id=id,
            workflow_id=workflow_id,
            driver=driver,
            step_name=step_name,
            script_path=script_path,
            command_line_tool=command_line_tool,
            inputs=inputs,
            outputs=outputs,
            status=status,
            date_created=date_created,
            date_finished=date_finished,
            owner=owner,
        )

        job_filter_fields_type_0.additional_properties = d
        return job_filter_fields_type_0

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
