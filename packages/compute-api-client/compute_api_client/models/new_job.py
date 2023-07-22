import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr
from dateutil.parser import isoparse

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.new_job_command_line_tool import NewJobCommandLineTool
    from ..models.new_job_inputs import NewJobInputs
    from ..models.new_job_outputs import NewJobOutputs


T = TypeVar("T", bound="NewJob")


@attr.s(auto_attribs=True)
class NewJob:
    """(tsType: Omit<Job, 'id' | 'status' | 'dateCreated'>, schemaOptions: { title: 'NewJob', exclude: [ 'id', 'status',
    'dateCreated' ] })

        Attributes:
            workflow_id (str):
            driver (str):
            step_name (str):
            script_path (str):
            command_line_tool (NewJobCommandLineTool):
            inputs (NewJobInputs):
            outputs (NewJobOutputs):
            date_finished (Union[Unset, datetime.datetime]):
            owner (Union[Unset, str]):
    """

    workflow_id: str
    driver: str
    step_name: str
    script_path: str
    command_line_tool: "NewJobCommandLineTool"
    inputs: "NewJobInputs"
    outputs: "NewJobOutputs"
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
        if date_finished is not UNSET:
            field_dict["dateFinished"] = date_finished
        if owner is not UNSET:
            field_dict["owner"] = owner

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.new_job_command_line_tool import NewJobCommandLineTool
        from ..models.new_job_inputs import NewJobInputs
        from ..models.new_job_outputs import NewJobOutputs

        d = src_dict.copy()
        workflow_id = d.pop("workflowId")

        driver = d.pop("driver")

        step_name = d.pop("stepName")

        script_path = d.pop("scriptPath")

        command_line_tool = NewJobCommandLineTool.from_dict(d.pop("commandLineTool"))

        inputs = NewJobInputs.from_dict(d.pop("inputs"))

        outputs = NewJobOutputs.from_dict(d.pop("outputs"))

        _date_finished = d.pop("dateFinished", UNSET)
        date_finished: Union[Unset, datetime.datetime]
        if isinstance(_date_finished, Unset):
            date_finished = UNSET
        else:
            date_finished = isoparse(_date_finished)

        owner = d.pop("owner", UNSET)

        new_job = cls(
            workflow_id=workflow_id,
            driver=driver,
            step_name=step_name,
            script_path=script_path,
            command_line_tool=command_line_tool,
            inputs=inputs,
            outputs=outputs,
            date_finished=date_finished,
            owner=owner,
        )

        new_job.additional_properties = d
        return new_job

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
