from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.pipeline_with_relations_inputs import PipelineWithRelationsInputs
    from ..models.pipeline_with_relations_outputs import PipelineWithRelationsOutputs
    from ..models.pipeline_with_relations_steps import PipelineWithRelationsSteps


T = TypeVar("T", bound="PipelineWithRelations")


@attr.s(auto_attribs=True)
class PipelineWithRelations:
    """(tsType: PipelineWithRelations, schemaOptions: { includeRelations: true })

    Attributes:
        name (str):
        version (str):
        inputs (PipelineWithRelationsInputs):
        outputs (PipelineWithRelationsOutputs):
        steps (PipelineWithRelationsSteps):
        id (Union[Unset, str]):
        owner (Union[Unset, str]):
    """

    name: str
    version: str
    inputs: "PipelineWithRelationsInputs"
    outputs: "PipelineWithRelationsOutputs"
    steps: "PipelineWithRelationsSteps"
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
        from ..models.pipeline_with_relations_inputs import PipelineWithRelationsInputs
        from ..models.pipeline_with_relations_outputs import PipelineWithRelationsOutputs
        from ..models.pipeline_with_relations_steps import PipelineWithRelationsSteps

        d = src_dict.copy()
        name = d.pop("name")

        version = d.pop("version")

        inputs = PipelineWithRelationsInputs.from_dict(d.pop("inputs"))

        outputs = PipelineWithRelationsOutputs.from_dict(d.pop("outputs"))

        steps = PipelineWithRelationsSteps.from_dict(d.pop("steps"))

        id = d.pop("id", UNSET)

        owner = d.pop("owner", UNSET)

        pipeline_with_relations = cls(
            name=name,
            version=version,
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            id=id,
            owner=owner,
        )

        pipeline_with_relations.additional_properties = d
        return pipeline_with_relations

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
