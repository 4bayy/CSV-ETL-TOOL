4. Schema stage

Once the files are uploaded, detect their columns.

Example:

HCP
HCP.csv

provider_code
service_code
base_price
quantity
region
Weekend Rates
WeekendRates.csv

region
weekend_rate

The UI can show:

Sources

[ HCP ] [ SAH ] [ Weekend Rates ]

──────────────────────────────────

HCP

provider_code     String
service_code      String
base_price        Decimal
quantity          Integer
region            String