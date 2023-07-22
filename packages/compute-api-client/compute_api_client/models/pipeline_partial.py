from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.pipeline_partial_inputs import PipelinePartialInputs
    from ..models.pipeline_partial_outputs import PipelinePartialOutputs
    from ..models.pipeline_partial_steps import PipelinePartialSteps


T = TypeVar("T", bound="PipelinePartial")


@attr.s(auto_attribs=True)
class PipelinePartial:
    """(tsType: Partial<Pipeline>, schemaOptions: { partial: true })

    Attributes:
        id (Union[Unset, str]):
        name (Union[Unset, str]):
        version (Union[Unset, str]):
        inputs (Union[Unset, PipelinePartialInputs]):
        outputs (Union[Unset, PipelinePartialOutputs]):
        steps (Union[Unset, PipelinePartialSteps]):
        owner (Union[Unset, str]):
    """

    id: Union[Unset, str] = UNSET
    name: Union[Unset, str] = UNSET
    version: Union[Unset, str] = UNSET
    inputs: Union[Unset, "PipelinePartialInputs"] = UNSET
    outputs: Union[Unset, "PipelinePartialOutputs"] = UNSET
    steps: Union[Unset, "PipelinePartialSteps"] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        id = self.id
        name = self.name
        version = self.version
        inputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.inputs, Unset):
            inputs = self.inputs.to_dict()

        outputs: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.outputs, Unset):
            outputs = self.outputs.to_dict()

        steps: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.steps, Unset):
            steps = self.steps.to_dict()

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
        from ..models.pipeline_partial_inputs import PipelinePartialInputs
        from ..models.pipeline_partial_outputs import PipelinePartialOutputs
        from ..models.pipeline_partial_steps import PipelinePartialSteps

        d = src_dict.copy()
        id = d.pop("id", UNSET)

        name = d.pop("name", UNSET)

        version = d.pop("version", UNSET)

        _inputs = d.pop("inputs", UNSET)
        inputs: Union[Unset, PipelinePartialInputs]
        if isinstance(_inputs, Unset):
            inputs = UNSET
        else:
            inputs = PipelinePartialInputs.from_dict(_inputs)

        _outputs = d.pop("outputs", UNSET)
        outputs: Union[Unset, PipelinePartialOutputs]
        if isinstance(_outputs, Unset):
            outputs = UNSET
        else:
            outputs = PipelinePartialOutputs.from_dict(_outputs)

        _steps = d.pop("steps", UNSET)
        steps: Union[Unset, PipelinePartialSteps]
        if isinstance(_steps, Unset):
            steps = UNSET
        else:
            steps = PipelinePartialSteps.from_dict(_steps)

        owner = d.pop("owner", UNSET)

        pipeline_partial = cls(
            id=id,
            name=name,
            version=version,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            owner=owner,
        )

        pipeline_partial.additional_properties = d
        return pipeline_partial

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
