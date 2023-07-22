import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr
from dateutil.parser import isoparse

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.new_workflow_cwl_job_inputs import NewWorkflowCwlJobInputs
    from ..models.new_workflow_inputs import NewWorkflowInputs
    from ..models.new_workflow_outputs import NewWorkflowOutputs
    from ..models.new_workflow_steps import NewWorkflowSteps


T = TypeVar("T", bound="NewWorkflow")


@attr.s(auto_attribs=True)
class NewWorkflow:
    """(tsType: Omit<Workflow, 'id' | 'status' | 'dateCreated'>, schemaOptions: { title: 'NewWorkflow', exclude: [ 'id',
    'status', 'dateCreated' ] })

        Attributes:
            name (str):
            inputs (NewWorkflowInputs):
            outputs (NewWorkflowOutputs):
            steps (NewWorkflowSteps):
            cwl_job_inputs (NewWorkflowCwlJobInputs):
            driver (Union[Unset, str]):
            date_finished (Union[Unset, datetime.datetime]):
            owner (Union[Unset, str]):
    """

    name: str
    inputs: "NewWorkflowInputs"
    outputs: "NewWorkflowOutputs"
    steps: "NewWorkflowSteps"
    cwl_job_inputs: "NewWorkflowCwlJobInputs"
    driver: Union[Unset, str] = UNSET
    date_finished: Union[Unset, datetime.datetime] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        name = self.name
        inputs = self.inputs.to_dict()

        outputs = self.outputs.to_dict()

        steps = self.steps.to_dict()

        cwl_job_inputs = self.cwl_job_inputs.to_dict()

        driver = self.driver
        date_finished: Union[Unset, str] = UNSET
        if not isinstance(self.date_finished, Unset):
            date_finished = self.date_finished.isoformat()

        owner = self.owner

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "inputs": inputs,
                "outputs": outputs,
                "steps": steps,
                "cwlJobInputs": cwl_job_inputs,
            }
        )
        if driver is not UNSET:
            field_dict["driver"] = driver
        if date_finished is not UNSET:
            field_dict["dateFinished"] = date_finished
        if owner is not UNSET:
            field_dict["owner"] = owner

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.new_workflow_cwl_job_inputs import NewWorkflowCwlJobInputs
        from ..models.new_workflow_inputs import NewWorkflowInputs
        from ..models.new_workflow_outputs import NewWorkflowOutputs
        from ..models.new_workflow_steps import NewWorkflowSteps

        d = src_dict.copy()
        name = d.pop("name")

        inputs = NewWorkflowInputs.from_dict(d.pop("inputs"))

        outputs = NewWorkflowOutputs.from_dict(d.pop("outputs"))

        steps = NewWorkflowSteps.from_dict(d.pop("steps"))

        cwl_job_inputs = NewWorkflowCwlJobInputs.from_dict(d.pop("cwlJobInputs"))

        driver = d.pop("driver", UNSET)

        _date_finished = d.pop("dateFinished", UNSET)
        date_finished: Union[Unset, datetime.datetime]
        if isinstance(_date_finished, Unset):
            date_finished = UNSET
        else:
            date_finished = isoparse(_date_finished)

        owner = d.pop("owner", UNSET)

        new_workflow = cls(
            name=name,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            cwl_job_inputs=cwl_job_inputs,
            driver=driver,
            date_finished=date_finished,
            owner=owner,
        )

        new_workflow.additional_properties = d
        return new_workflow

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
