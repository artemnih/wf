import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr
from dateutil.parser import isoparse

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.job_partial_command_line_tool import JobPartialCommandLineTool
    from ..models.job_partial_inputs import JobPartialInputs
    from ..models.job_partial_outputs import JobPartialOutputs


T = TypeVar("T", bound="JobPartial")


@attr.s(auto_attribs=True)
class JobPartial:
    """(tsType: Partial<Job>, schemaOptions: { partial: true })

    Attributes:
        id (Union[Unset, str]):
        workflow_id (Union[Unset, str]):
        driver (Union[Unset, str]):
        step_name (Union[Unset, str]):
        script_path (Union[Unset, str]):
        command_line_tool (Union[Unset, JobPartialCommandLineTool]):
        inputs (Union[Unset, JobPartialInputs]):
        outputs (Union[Unset, JobPartialOutputs]):
        status (Union[Unset, str]):
        date_created (Union[Unset, datetime.datetime]):
        date_finished (Union[Unset, datetime.datetime]):
        owner (Union[Unset, str]):
    """

    id: Union[Unset, str] = UNSET
    workflow_id: Union[Unset, str] = UNSET
    driver: Union[Unset, str] = UNSET
    step_name: Union[Unset, str] = UNSET
    script_path: Union[Unset, str] = UNSET
    command_line_tool: Union[Unset, "JobPartialCommandLineTool"] = UNSET
    inputs: Union[Unset, "JobPartialInputs"] = UNSET
    outputs: Union[Unset, "JobPartialOutputs"] = UNSET
    status: Union[Unset, str] = UNSET
    date_created: Union[Unset, datetime.datetime] = UNSET
    date_finished: Union[Unset, datetime.datetime] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        workflow_id = self.workflow_id
        driver = self.driver
        step_name = self.step_name
        script_path = self.script_path
        command_line_tool: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.command_line_tool, Unset):
            command_line_tool = self.command_line_tool.to_dict()

        inputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.inputs, Unset):
            inputs = self.inputs.to_dict()

        outputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.outputs, Unset):
            outputs = self.outputs.to_dict()

        status = self.status
        date_created: Union[Unset, str] = UNSET
        if not isinstance(self.date_created, Unset):
            date_created = self.date_created.isoformat()

        date_finished: Union[Unset, str] = UNSET
        if not isinstance(self.date_finished, Unset):
            date_finished = self.date_finished.isoformat()

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
        from ..models.job_partial_command_line_tool import JobPartialCommandLineTool
        from ..models.job_partial_inputs import JobPartialInputs
        from ..models.job_partial_outputs import JobPartialOutputs

        d = src_dict.copy()
        id = d.pop("id", UNSET)

        workflow_id = d.pop("workflowId", UNSET)

        driver = d.pop("driver", UNSET)

        step_name = d.pop("stepName", UNSET)

        script_path = d.pop("scriptPath", UNSET)

        _command_line_tool = d.pop("commandLineTool", UNSET)
        command_line_tool: Union[Unset, JobPartialCommandLineTool]
        if isinstance(_command_line_tool, Unset):
            command_line_tool = UNSET
        else:
            command_line_tool = JobPartialCommandLineTool.from_dict(_command_line_tool)

        _inputs = d.pop("inputs", UNSET)
        inputs: Union[Unset, JobPartialInputs]
        if isinstance(_inputs, Unset):
            inputs = UNSET
        else:
            inputs = JobPartialInputs.from_dict(_inputs)

        _outputs = d.pop("outputs", UNSET)
        outputs: Union[Unset, JobPartialOutputs]
        if isinstance(_outputs, Unset):
            outputs = UNSET
        else:
            outputs = JobPartialOutputs.from_dict(_outputs)

        status = d.pop("status", UNSET)

        _date_created = d.pop("dateCreated", UNSET)
        date_created: Union[Unset, datetime.datetime]
        if isinstance(_date_created, Unset):
            date_created = UNSET
        else:
            date_created = isoparse(_date_created)

        _date_finished = d.pop("dateFinished", UNSET)
        date_finished: Union[Unset, datetime.datetime]
        if isinstance(_date_finished, Unset):
            date_finished = UNSET
        else:
            date_finished = isoparse(_date_finished)

        owner = d.pop("owner", UNSET)

        job_partial = cls(
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

        job_partial.additional_properties = d
        return job_partial

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
