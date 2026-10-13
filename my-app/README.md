CSVFlow
A visual CSV workflow tool for preparing, transforming, validating, and exporting CSV data.

CSVFlow is designed to make repetitive CSV cleanup and data-preparation tasks easier without requiring users to write a script for every dataset. Build a workflow around uploading files, defining transformations, reviewing the results, and exporting the processed data.
Project status: Update this section to reflect the current implementation. Features that still use mock/demo data or need a backend should be marked as planned rather than production-ready.

<!-- Screenshots
Add screenshots of the running application to docs/screenshots/, then update the paths below to match the image filenames. GitHub renders these images directly in the README.
Dashboard -->

Upload CSV files

Transform and map data

Review and export results

Taking screenshots: Run the app locally, open each relevant screen, and capture the browser viewport. Save the images using the filenames above, or change the Markdown image paths to match your filenames. Do not commit screenshots containing real customer data, credentials, or other sensitive information.
Why CSVFlow?
Working with CSV data often involves the same manual steps over and over:
- Renaming inconsistent column headers across files.
- Cleaning empty or malformed values.
- Converting dates, numbers, and text into a consistent format.
- Applying formulas or business rules to rows.
- Checking data before importing it into another system.
- Repeating the same process whenever a new file arrives.
CSVFlow aims to put these steps into a repeatable workflow with a visual interface.
Core workflow
1. Upload files — select the CSV files you want to process.
2. Transform — configure column mapping, cleanup rules, and formulas.
3. Review — inspect the transformed data and check for issues.
4. Execute and export — run the workflow and download the output when supported by the current implementation.
Features
Mark a feature as available only after verifying it in the current build.
- [x] React-based user interface
- [x] Dashboard navigation for workflow, comparison, history, and settings areas
- [ ] CSV upload and parsing for real user files
- [ ] Automatic column/header detection
- [ ] Column mapping and renaming
- [ ] Data transformations and formula rules
- [ ] Preview transformed rows before execution
- [ ] Validation with row-level error reporting
- [ ] Export processed data as CSV
- [ ] Save and reuse workflows
- [ ] Multi-file processing and merging
- [ ] Persistent run history and backend job processing
The unchecked items are a feature checklist/roadmap, not a claim that those features are already implemented.
Use cases
1. Normalize exports from different systems
Different systems may use different headers for the same field.
Source header	Standardized field
Amount, Total, Price	amount
Date, SaleDate, TransactionDate	sale_date
Customer, CustomerName, Client	customer_name


Map the source columns to a shared schema so downstream reports or imports receive consistent fields.
2. Prepare transaction data for reporting
- Standardize date and amount columns.
- Remove or flag rows with missing required values.
- Review the result before downloading it for a spreadsheet or reporting tool.
3. Clean CSV files before importing them into an application
Prepare data for a CRM, billing system, inventory application, or internal database by aligning column names and validating required fields before import.
4. Apply repeatable data rules
For recurring monthly or weekly exports, define a transformation workflow once and reuse it for later files, when workflow persistence is available.
5. Compare datasets
Use the CSV comparison area to support investigations such as checking two exports for differences. Confirm the comparison behavior and supported file sizes in the current build before relying on it for critical data.
Example workflow
Suppose a sales platform exports this CSV:
TransactionDate,Customer,Total
2026-09-01,Asha,1200
2026-09-02,Rahul,850
A workflow could map TransactionDate to sale_date, Customer to customer_name, and Total to amount, then validate the rows and export a standardized file:
sale_date,customer_name,amount
2026-09-01,Asha,1200
2026-09-02,Rahul,850
This is an illustrative example of the intended workflow; it does not imply that every transformation shown is already connected to a production backend.
Tech stack
Based on the current frontend project structure, the UI uses:
- React — component-based frontend
- Tailwind CSS — utility-first styling
- React Router — client-side navigation
- Zustand — shared client state where used
- Lucide React — interface icons
The backend, storage, authentication, and data-processing stack should be documented here once those parts are selected and connected. Do not list planned technologies as implemented dependencies.
Getting started
Prerequisites
- Node.js (use the version required by the project's package.json)
- npm, or the package manager used by this repository
Installation
git clone <your-repository-url>
cd <repository-folder>
npm install
npm run dev
Use the actual repository URL and folder name when sharing these instructions. If npm run dev is not defined in package.json, use the start command configured by the project.
Available scripts
Check package.json for the scripts supported by this repository. Typical Vite-based scripts look like:
npm run dev
npm run build
npm run preview
These are examples; keep only commands that actually exist in the project's package.json.
Suggested repository structure
.
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── ...
├── docs/
│   └── screenshots/
├── package.json
└── README.md
Adapt this tree to match the actual project structure.
Roadmap
- Complete reliable CSV parsing and upload validation.
- Add schema inference and configurable column mapping.
- Implement transformation rules and formula validation.
- Provide data previews and actionable row-level errors.
- Add export handling for successful rows and rejected rows.
- Persist workflows and execution history.
- Add secure authentication, file-size limits, and background processing if required.
- Add automated tests for transformation and validation behavior.
Security and data handling
CSV files may contain personal, financial, or business-sensitive information. Before using CSVFlow with real data, verify how files are stored, processed, logged, retained, and deleted. Avoid uploading sensitive production data to a demo build.
Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make a focused change and add tests where appropriate.
4. Run the project's linting, tests, and build commands.
5. Open a pull request with a clear description and screenshots for UI changes.
License
Add a LICENSE file and update this section with the chosen license before distributing the project.