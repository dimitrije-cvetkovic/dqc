from typing import Dict, Any, List, Tuple
import pandas as pd


# - **UNIFORMITY** Is the data in the same format (per column)?
# - **DUPLICATES** Are no duplicates in the data?
# - **MISSING VALUES** Are there any null / missing values?
# - **OUTLIERS** Any outliers in the data (per column)?




column_name = str


class DataClass:
    def __init__(self, path: str, separator: str = ",") -> None:
        self.df: pd.DataFrame = pd.read_csv(path, sep=separator)

    def check_uniformity(self) -> Dict[column_name, List[int]]:
        # Return a dict mapping column name to a list of row indexes which are not uniform

        uniformity = {}

        for col in self.df.columns:
            #^-?\d*\.{0,1}\d+$
            column_types = self.df[col].apply(lambda x: type(int).__name__ if type(x).__name__ == 'str' and x.isnumeric() else type(x).__name__)

            column_types_groupped = column_types.value_counts()

            if column_types_groupped.__len__() == 1:
                continue
            
            non_uniform_column_types = column_types_groupped.index[1:].values

            uniformity[col] = [i for i, item in enumerate(column_types) if item in non_uniform_column_types]

        return uniformity

    def check_duplicates(self) -> List[Tuple[int]]:
        # Return a list of tuples of row indexes where each tuple represents a duplicate group

        #keep=false marks all duplicates as true
        duplicates_df = self.df[self.df.duplicated(keep=False)]

        duplicates = duplicates_df.groupby(list(duplicates_df.columns)).apply(lambda x: tuple(x.index))

        if duplicates.empty:
            return

        return duplicates.tolist()

    def check_missing_values(self) -> List[int]:
        # Return the row indexes which contain empty values

        return self.df[self.df.isnull().any(axis=1)].index.tolist()

    def check_outliers(self) -> Dict[column_name, List[int]]:
        # Outliers are defined by the 1.5 IQR method.
        # see https://towardsdatascience.com/why-1-5-in-iqr-method-of-outlier-detection-5d07fdc82097
        # for a detailed explanation
        # Return a dict mapping column name to a list of row indexes which are outliers
        outliers = {}

        for col in self.df.columns:

            column = self.df[col]

            if self.df[col].dtype not in ['int64', 'float64']:
                continue

            q1 = column.quantile(0.25)
            q3 = column.quantile(0.75)
            iqr = q3 - q1

            condition = ((column < (q1 - 1.5 * iqr)) | (column > (q3 + 1.5 * iqr)))
            # print(q1, q3, iqr, q1 - 1.5 * iqr, q3 + 1.5 * iqr)
            # print(condition)
            filtered_df = self.df[col][condition]

            outliers[col] = filtered_df.index.values.tolist()

        return outliers

    def generate_report(self) -> Dict[str, Any]:
        report = {
            "UNIFORMITY": self.check_uniformity(),
            "DUPLICATE_ROWS": self.check_duplicates(),
            "MISSING_VALUE_ROWS": self.check_missing_values(),
            "OUTLIERS": self.check_outliers(),
        }
        return report
