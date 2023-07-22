import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr
from dateutil.parser import isoparse

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.job_command_line_tool import JobCommandLineTool
    from ..models.job_inputs import JobInputs
    from ..models.job_outputs import JobOutputs


T = TypeVar("T", bound="Job")


@attr.s(auto_attribs=True)
class Job:
    """
    Attributes:
        workflow_id (str):
        driver (str):
        step_name (str):
        script_path (str):
        command_line_tool (JobCommandLineTool):
        inputs (JobInputs):
        outputs (JobOutputs):
        id (Union[Unset, str]):
        status (Union[Unset, str]):
        date_created (Union[Unset, datetime.datetime]):
        date_finished (Union[Unset, datetime.datetime]):
        owner (Union[Unset, str]):
    """

    workflow_id: str
    driver: str
    step_name: str
    script_path: str
    command_line_tool: "JobCommandLineTool"
    inputs: "JobInputs"
    outputs: "JobOutputs"
    id: Union[Unset, str] = UNSET
    status: Union[Unset, str] = UNSET
    date_created: Union[Unset, datetime.datetime] = UNSET
    date_finished: Union[Unset, datetime.datetime] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        workflow_id = self.workflow_id
        driver = self.driver
        step_name = self.step_name
        script_path = self.script_path
        command_line_tool = self.command_line_tool.to_dict()

        inputs = self.inputs.to_dict()

        outputs = self.outputs.to_dict()

        id = self.id
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
        field_dict.update(
            {
                "workflowId": workflow_id,
                "driver": driver,
                "stepName": step_name,
                "scriptPath": script_path,
                "commandLineTool": command_line_tool,
                "inputs": inputs,
                "outputs": outputs,
            }
        )
        if id is not UNSET:
            field_dict["id"] = id
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
        from ..models.job_command_line_tool import JobCommandLineTool
        from ..models.job_inputs import JobInputs
        from ..models.job_outputs import JobOutputs

        d = src_dict.copy()
        workflow_id = d.pop("workflowId")

        driver = d.pop("driver")

        step_name = d.pop("stepName")

        script_path = d.pop("scriptPath")

        command_line_tool = JobCommandLineTool.from_dict(d.pop("commandLineTool"))

        inputs = JobInputs.from_dict(d.pop("inputs"))

        outputs = JobOutputs.from_dict(d.pop("outputs"))

        id = d.pop("id", UNSET)

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

        job = cls(
            workflow_id=workflow_id,
            driver=driver,
            step_name=step_name,
            script_path=script_path,
            command_line_tool=command_line_tool,
            inputs=inputs,
            outputs=outputs,
            id=id,
            status=status,
            date_created=date_created,
            date_finished=date_finished,
            owner=owner,
        )

        job.additional_properties = d
        return job

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
