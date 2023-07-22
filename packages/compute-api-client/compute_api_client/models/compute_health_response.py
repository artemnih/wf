from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.compute_health_response_headers import ComputeHealthResponseHeaders


T = TypeVar("T", bound="ComputeHealthResponse")


@attr.s(auto_attribs=True)
class ComputeHealthResponse:
    """
    Attributes:
        greeting (Union[Unset, str]):
        date (Union[Unset, str]):
        url (Union[Unset, str]):
        headers (Union[Unset, ComputeHealthResponseHeaders]):
    """

    greeting: Union[Unset, str] = UNSET
    date: Union[Unset, str] = UNSET
    url: Union[Unset, str] = UNSET
    headers: Union[Unset, "ComputeHealthResponseHeaders"] = UNSET
    additional_properties: Dict[str, Any] = attr.ib(init=False, factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        greeting = self.greeting
        date = self.date
        url = self.url
        headers: Union[Unset, Dict[str, Any]] = UNSET
        if not isinstance(self.headers, Unset):
            headers = self.headers.to_dict()

        field_dict: Dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if greeting is not UNSET:
            field_dict["greeting"] = greeting
        if date is not UNSET:
            field_dict["date"] = date
        if url is not UNSET:
            field_dict["url"] = url
        if headers is not UNSET:
            field_dict["headers"] = headers

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.compute_health_response_headers import ComputeHealthResponseHeaders

        d = src_dict.copy()
        greeting = d.pop("greeting", UNSET)

        date = d.pop("date", UNSET)

        url = d.pop("url", UNSET)

        _headers = d.pop("headers", UNSET)
        headers: Union[Unset, ComputeHealthResponseHeaders]
        if isinstance(_headers, Unset):
            headers = UNSET
        else:
            headers = ComputeHealthResponseHeaders.from_dict(_headers)

        compute_health_response = cls(
            greeting=greeting,
            date=date,
            url=url,
            headers=headers,
        )

        compute_health_response.additional_properties = d
        return compute_health_response

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
