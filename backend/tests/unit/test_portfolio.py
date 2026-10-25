from app.domain.portfolio import Stock, grand_total


def test_stock_total_is_shares_times_price() -> None:
    stock = Stock(name="IBM", shares=25, price=1000)

    assert stock.total == 25000
