def alpaca_get_account_unifier(platform_result):
    res = {
        "id": platform_result["id"],
        "account_number": platform_result["account_number"],
        "account_name": platform_result["account_number"],
        "status": platform_result["status"],
        "currency": platform_result["currency"],
        "created_at": platform_result["created_at"],
        "platform": "alpaca",
        "framework": "alpaca",
        "cash": float(platform_result["cash"]),
        "total_value": float(platform_result["equity"]),
        "buying_power": float(platform_result["buying_power"]),
        "total_invested": abs(float(platform_result["long_market_value"])) + abs(float(platform_result["short_market_value"])),
        "short_market_value": abs(float(platform_result["short_market_value"])),
        "long_market_value": abs(float(platform_result["long_market_value"])),
    }

    res["withdrawable_cash"] = res["cash"] - 1.5 * res["short_market_value"]
    if res["withdrawable_cash"] < 0:
        res["withdrawable_cash"] = 0

    res["short_value"] = res["short_market_value"]
    res["long_value"] = res["long_market_value"]
    res["margin_used"] = "UNKNOWN-ROY"
    res["margin_cost"] = "UNKNOWN-ROY"

    return res
