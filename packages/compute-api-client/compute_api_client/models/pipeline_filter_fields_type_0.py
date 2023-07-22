from typing import Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

T = TypeVar("T", bound="PipelineFilterFieldsType0")


@attr.s(auto_attribs=True)
class PipelineFilterFieldsType0:
    """
    Attributes:
        id (Union[Unset, bool]):
        name (Union[Unset, bool]):
        version (Union[Unset, bool]):
        inputs (Union[Unset, bool]):
        outputs (Union[Unset, bool]):
        steps (Union[Unset, bool]):
        owner (Union[Unset, bool]):
    """

    id: Union[Unset, bool] = UNSET
    name: Union[Unset, bool] = UNSET
    version: Union[Unset, bool] = UNSET
    inputs: Union[Unset, bool] = UNSET
    outputs: Union[Unset, bool] = UNSET
    steps: Union[Unset, bool] = UNSET
    owner: Union[Unset, bool] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        name = self.name
        version = self.version
        inputs = self.inputs
        outputs = self.outputs
        steps = self.steps
        owner = self.owner

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if id is not UNSET:
            field_dict["id"] = id
        if name is not UNSET:
            field_dict["name"] = name
        if version is not UNSET:
            field_dict["version"] = version
        if inputs is not UNSET:
            field_dict["inputs"] = inputs
        if outputs is not UNSET:
            field_dict["outputs"] = outputs
        if steps is not UNSET:
            field_dict["steps"] = steps
        if owner is not UNSET:
            field_dict["owner"] = owner

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        d = src_dict.copy()
        id = d.pop("id", UNSET)

        name = d.pop("name", UNSET)

        version = d.pop("version", UNSET)

        inputs = d.pop("inputs", UNSET)

        outputs = d.pop("outputs", UNSET)

        steps = d.pop("steps", UNSET)

        owner = d.pop("owner", UNSET)

        pipeline_filter_fields_type_0 = cls(
            id=id,
            name=name,
            version=version,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            owner=owner,
        )

        pipeline_filter_fields_type_0.additional_properties = d
        return pipeline_filter_fields_type_0

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
