from typing import Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

T = TypeVar("T", bound="WorkflowFilterFieldsType0")


@attr.s(auto_attribs=True)
class WorkflowFilterFieldsType0:
    """
    Attributes:
        id (Union[Unset, bool]):
        name (Union[Unset, bool]):
        driver (Union[Unset, bool]):
        inputs (Union[Unset, bool]):
        outputs (Union[Unset, bool]):
        steps (Union[Unset, bool]):
        cwl_job_inputs (Union[Unset, bool]):
        status (Union[Unset, bool]):
        date_created (Union[Unset, bool]):
        date_finished (Union[Unset, bool]):
        owner (Union[Unset, bool]):
    """

    id: Union[Unset, bool] = UNSET
    name: Union[Unset, bool] = UNSET
    driver: Union[Unset, bool] = UNSET
    inputs: Union[Unset, bool] = UNSET
    outputs: Union[Unset, bool] = UNSET
    steps: Union[Unset, bool] = UNSET
    cwl_job_inputs: Union[Unset, bool] = UNSET
    status: Union[Unset, bool] = UNSET
    date_created: Union[Unset, bool] = UNSET
    date_finished: Union[Unset, bool] = UNSET
    owner: Union[Unset, bool] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        name = self.name
        driver = self.driver
        inputs = self.inputs
        outputs = self.outputs
        steps = self.steps
        cwl_job_inputs = self.cwl_job_inputs
        status = self.status
        date_created = self.date_created
        date_finished = self.date_finished
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
        d = src_dict.copy()
        id = d.pop("id", UNSET)

        name = d.pop("name", UNSET)

        driver = d.pop("driver", UNSET)

        inputs = d.pop("inputs", UNSET)

        outputs = d.pop("outputs", UNSET)

        steps = d.pop("steps", UNSET)

        cwl_job_inputs = d.pop("cwlJobInputs", UNSET)

        status = d.pop("status", UNSET)

        date_created = d.pop("dateCreated", UNSET)

        date_finished = d.pop("dateFinished", UNSET)

        owner = d.pop("owner", UNSET)

        workflow_filter_fields_type_0 = cls(
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

        workflow_filter_fields_type_0.additional_properties = d
        return workflow_filter_fields_type_0

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
