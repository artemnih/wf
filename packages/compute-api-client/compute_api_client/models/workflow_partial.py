import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr
from dateutil.parser import isoparse

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.workflow_partial_cwl_job_inputs import WorkflowPartialCwlJobInputs
    from ..models.workflow_partial_inputs import WorkflowPartialInputs
    from ..models.workflow_partial_outputs import WorkflowPartialOutputs
    from ..models.workflow_partial_steps import WorkflowPartialSteps


T = TypeVar("T", bound="WorkflowPartial")


@attr.s(auto_attribs=True)
class WorkflowPartial:
    """(tsType: Partial<Workflow>, schemaOptions: { partial: true })

    Attributes:
        id (Union[Unset, str]):
        name (Union[Unset, str]):
        driver (Union[Unset, str]):
        inputs (Union[Unset, WorkflowPartialInputs]):
        outputs (Union[Unset, WorkflowPartialOutputs]):
        steps (Union[Unset, WorkflowPartialSteps]):
        cwl_job_inputs (Union[Unset, WorkflowPartialCwlJobInputs]):
        status (Union[Unset, str]):
        date_created (Union[Unset, datetime.datetime]):
        date_finished (Union[Unset, datetime.datetime]):
        owner (Union[Unset, str]):
    """

    id: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    driver: Union[Unset, str] = UNSET
    inputs: Union[Unset, "WorkflowPartialInputs"] = UNSET
    outputs: Union[Unset, "WorkflowPartialOutputs"] = UNSET
    steps: Union[Unset, "WorkflowPartialSteps"] = UNSET
    cwl_job_inputs: Union[Unset, "WorkflowPartialCwlJobInputs"] = UNSET
    status: Union[Unset, str] = UNSET
    date_created: Union[Unset, datetime.datetime] = UNSET
    date_finished: Union[Unset, datetime.datetime] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        name = self.name
        driver = self.driver
        inputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.inputs, Unset):
            inputs = self.inputs.to_dict()

        outputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.outputs, Unset):
            outputs = self.outputs.to_dict()

        steps: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.steps, Unset):
            steps = self.steps.to_dict()

        cwl_job_inputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.cwl_job_inputs, Unset):
            cwl_job_inputs = self.cwl_job_inputs.to_dict()

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
        if name is not UNSET:
            field_dict["name"] = name
        if driver is not UNSET:
            field_dict["driver"] = driver
        if inputs is not UNSET:
            field_dict["inputs"] = inputs
        if outputs is not UNSET:
            field_dict["outputs"] = outputs
        if steps is not UNSET:
            field_dict["steps"] = steps
        if cwl_job_inputs is not UNSET:
            field_dict["cwlJobInputs"] = cwl_job_inputs
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
        from ..models.workflow_partial_cwl_job_inputs import WorkflowPartialCwlJobInputs
        from ..models.workflow_partial_inputs import WorkflowPartialInputs
        from ..models.workflow_partial_outputs import WorkflowPartialOutputs
        from ..models.workflow_partial_steps import WorkflowPartialSteps

        d = src_dict.copy()
        id = d.pop("id", UNSET)

        name = d.pop("name", UNSET)

        driver = d.pop("driver", UNSET)

        _inputs = d.pop("inputs", UNSET)
        inputs: Union[Unset, WorkflowPartialInputs]
        if isinstance(_inputs, Unset):
            inputs = UNSET
        else:
            inputs = WorkflowPartialInputs.from_dict(_inputs)

        _outputs = d.pop("outputs", UNSET)
        outputs: Union[Unset, WorkflowPartialOutputs]
        if isinstance(_outputs, Unset):
            outputs = UNSET
        else:
            outputs = WorkflowPartialOutputs.from_dict(_outputs)

        _steps = d.pop("steps", UNSET)
        steps: Union[Unset, WorkflowPartialSteps]
        if isinstance(_steps, Unset):
            steps = UNSET
        else:
            steps = WorkflowPartialSteps.from_dict(_steps)

        _cwl_job_inputs = d.pop("cwlJobInputs", UNSET)
        cwl_job_inputs: Union[Unset, WorkflowPartialCwlJobInputs]
        if isinstance(_cwl_job_inputs, Unset):
            cwl_job_inputs = UNSET
        else:
            cwl_job_inputs = WorkflowPartialCwlJobInputs.from_dict(_cwl_job_inputs)

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

        workflow_partial = cls(
            id=id,
            name=name,
            driver=driver,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            cwl_job_inputs=cwl_job_inputs,
            status=status,
            date_created=date_created,
            date_finished=date_finished,
            owner=owner,
        )

        workflow_partial.additional_properties = d
        return workflow_partial

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
