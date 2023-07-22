from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.new_pipeline_inputs import NewPipelineInputs
    from ..models.new_pipeline_outputs import NewPipelineOutputs
    from ..models.new_pipeline_steps import NewPipelineSteps


T = TypeVar("T", bound="NewPipeline")


@attr.s(auto_attribs=True)
class NewPipeline:
    """(tsType: Pipeline, schemaOptions: { title: 'NewPipeline' })

    Attributes:
        name (str):
        version (str):
        inputs (NewPipelineInputs):
        outputs (NewPipelineOutputs):
        steps (NewPipelineSteps):
        id (Union[Unset, str]):
        owner (Union[Unset, str]):
    """

    name: str
    version: str
    inputs: "NewPipelineInputs"
    outputs: "NewPipelineOutputs"
    steps: "NewPipelineSteps"
    id: Union[Unset, str] = UNSET
    owner: Union[Unset, str] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        name = self.name
        version = self.version
        inputs = self.inputs.to_dict()

        outputs = self.outputs.to_dict()

        steps = self.steps.to_dict()

        id = self.id
        owner = self.owner

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "version": version,
                "inputs": inputs,
                "outputs": outputs,
                "steps": steps,
            }
        )
        if id is not UNSET:
            field_dict["id"] = id
        if owner is not UNSET:
            field_dict["owner"] = owner

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.new_pipeline_inputs import NewPipelineInputs
        from ..models.new_pipeline_outputs import NewPipelineOutputs
        from ..models.new_pipeline_steps import NewPipelineSteps

        d = src_dict.copy()
        name = d.pop("name")

        version = d.pop("version")

        inputs = NewPipelineInputs.from_dict(d.pop("inputs"))

        outputs = NewPipelineOutputs.from_dict(d.pop("outputs"))

        steps = NewPipelineSteps.from_dict(d.pop("steps"))

        id = d.pop("id", UNSET)

        owner = d.pop("owner", UNSET)

        new_pipeline = cls(
            name=name,
            version=version,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            id=id,
            owner=owner,
        )

        new_pipeline.additional_properties = d
        return new_pipeline

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
