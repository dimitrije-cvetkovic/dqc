import unittest
from data_class import DataClass

class Test(unittest.TestCase):

    def test_outliers(self):
        data_class_wrong_data = DataClass("tests/test_data/outliers.csv")
        assert data_class_wrong_data
        report = data_class_wrong_data.generate_report()
        outliers = report.get("OUTLIERS")
        assert outliers
        outlier_column = outliers.get("CO2 Emissions(g/km)")
        assert outlier_column == [12]


    def test_no_outliers(self):
        data_class_correct_data = DataClass("tests/test_data/correct_data_types.csv")
        assert data_class_correct_data
        report = data_class_correct_data.generate_report()
        assert not any(report.get("OUTLIERS", {}).values())


if __name__ == "__main__":
    unittest.main()
