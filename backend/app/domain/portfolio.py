from collections.abc import Iterable
from dataclasses import dataclass


@dataclass(frozen=True)
class Stock:
    name: str
    shares: int
    price: int

    @property
    def total(self) -> int:
        return self.shares * self.price


