import unittest
import json

from mt5_get_account_unifier import mt5_get_account_unifier


class TestAlpacaUnifier(unittest.TestCase):
    def test_unify_from_file(self):
        # Load the sample data from JSON file
        with open("unifiers/samples.json", "r") as f:
            data = json.load(f)

        # Access the specific Alpaca account
        sample = data["accounts"]["FOREX.comCA__FAKELOGIN001"]

        # Run the unifier
        result = mt5_get_account_unifier(sample)

        # # Basic structural checks
        # self.assertEqual(result["platform"], "FOREX.comCA")
        # self.assertEqual(result["framework"], "mt5")
        # self.assertEqual(result["status"], "ACTIVE")

        # # Numerical consistency checks
        # total_invested = abs(
        #     float(sample["long_market_value"])) + abs(float(sample["short_market_value"]))
        # self.assertEqual(result["total_invested"], total_invested)

        # withdrawable_cash_expected = float(
        #     sample["cash"]) - 1.5 * abs(float(sample["short_market_value"]))
        # if withdrawable_cash_expected < 0:
        #     withdrawable_cash_expected = 0
        # self.assertEqual(result["withdrawable_cash"],
        #                  withdrawable_cash_expected)

        # # Margin placeholders
        # self.assertEqual(result["margin_used"], "UNKNOWN-ROY")
        # self.assertEqual(result["margin_cost"], "UNKNOWN-ROY")


if __name__ == "__main__":
    unittest.main()
