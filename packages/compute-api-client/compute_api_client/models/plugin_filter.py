from typing import TYPE_CHECKING, Any, Dict, List, Type, TypeVar, Union, cast

import attr

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.plugin_filter_fields_type_0 import PluginFilterFieldsType0


T = TypeVar("T", bound="PluginFilter")


@attr.s(auto_attribs=True)
class PluginFilter:
    """
    Attributes:
        offset (Union[Unset, int]):
        limit (Union[Unset, int]):  Example: 100.
        skip (Union[Unset, int]):
        order (Union[List[str], Unset, str]):
        fields (Union['PluginFilterFieldsType0', List[str], Unset]):
    """

    offset: Union[Unset, int] = UNSET
    limit: Union[Unset, int] = UNSET
    skip: Union[Unset, int] = UNSET
    order: Union[List[str], Unset, str] = UNSET
    fields: Union["PluginFilterFieldsType0", List[str], Unset] = UNSET

    def to_dict(self) -> Dict[str, Any]:
        from ..models.plugin_filter_fields_type_0 import PluginFilterFieldsType0

        offset = self.offset
        limit = self.limit
        skip = self.skip
        order: Union[List[str], Unset, str]
        if isinstance(self.order, Unset):
            order = UNSET

        elif isinstance(self.order, list):
            order = UNSET
            if not isinstance(self.order, Unset):
                order = self.order

        else:
            order = self.order

        fields: Union[Dict[str, Any], List[str], Unset]
        if isinstance(self.fields, Unset):
            fields = UNSET

        elif isinstance(self.fields, PluginFilterFieldsType0):
            fields = UNSET
            if not isinstance(self.fields, Unset):
                fields = self.fields.to_dict()

        else:
            fields = UNSET
            if not isinstance(self.fields, Unset):
                fields = self.fields

        field_dict: Dict[str, Any] = {}
        field_dict.update({})
        if offset is not UNSET:
            field_dict["offset"] = offset
        if limit is not UNSET:
            field_dict["limit"] = limit
        if skip is not UNSET:
            field_dict["skip"] = skip
        if order is not UNSET:
            field_dict["order"] = order
        if fields is not UNSET:
            field_dict["fields"] = fields

        return field_dict

    @classmethod
    def from_dict(cls: Type[T], src_dict: Dict[str, Any]) -> T:
        from ..models.plugin_filter_fields_type_0 import PluginFilterFieldsType0

        d = src_dict.copy()
        offset = d.pop("offset", UNSET)

        limit = d.pop("limit", UNSET)

        skip = d.pop("skip", UNSET)

        def _parse_order(data: object) -> Union[List[str], Unset, str]:
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                order_type_1 = cast(List[str], data)

                return order_type_1
            except:  # noqa: E722
                pass
            return cast(Union[List[str], Unset, str], data)

        order = _parse_order(d.pop("order", UNSET))

        def _parse_fields(data: object) -> Union["PluginFilterFieldsType0", List[str], Unset]:
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                _fields_type_0 = data
                fields_type_0: Union[Unset, PluginFilterFieldsType0]
                if isinstance(_fields_type_0, Unset):
                    fields_type_0 = UNSET
                else:
                    fields_type_0 = PluginFilterFieldsType0.from_dict(_fields_type_0)

                return fields_type_0
            except:  # noqa: E722
                pass
            if not isinstance(data, list):
                raise TypeError()
            fields_type_1 = cast(List[str], data)

            return fields_type_1

        fields = _parse_fields(d.pop("fields", UNSET))

        plugin_filter = cls(
            offset=offset,
            limit=limit,
            skip=skip,
            order=order,
            fields=fields,
        )

        return plugin_filter
