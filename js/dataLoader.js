// dataLoader.js - Simple Excel File Loading Module

class DataLoader {
    constructor() {
        this.data = null;
        this.fileName = null;
    }

    /**
     * Load Excel file from file input
     */
    async loadFromFile(file) {
        console.log('Loading file:', file.name);
        this.fileName = file.name;
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Get first sheet
                    const firstSheetName = workbook.SheetNames[0];
                    console.log('Reading sheet:', firstSheetName);
                    
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                        header: 1,  // Get as array (including headers)
                        defval: '', // Default value for empty cells
                        blankrows: false // Skip blank rows
                    });
                    
                    // Check if we have data
                    if (jsonData.length < 2) {
                        throw new Error('檔案中沒有足夠的資料');
                    }
                    
                    // Parse into structured format
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1);
                    
                    console.log('Found columns:', headers);
                    console.log('Found', rows.length, 'rows of data');
                    
                    // Convert rows to objects using headers
                    const objectData = rows.map((row, index) => {
                        const obj = { _rowIndex: index + 2 }; // Keep track of original row number
                        headers.forEach((header, colIndex) => {
                            obj[header] = row[colIndex] || '';
                        });
                        return obj;
                    });
                    
                    this.data = {
                        headers: headers,
                        rows: objectData,
                        raw: jsonData
                    };
                    
                    resolve(this.data);
                    
                } catch (error) {
                    console.error('Error reading Excel file:', error);
                    reject(new Error('無法讀取 Excel 檔案: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('檔案讀取失敗'));
            };
            
            // Read the file
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Load default data.xlsx from the same folder
     */
    async loadDefaultFile() {
        console.log('Loading default data.xlsx...');
        
        try {
            // Try to fetch data.xlsx from the same directory
            const response = await fetch('data.xlsx');
            
            if (!response.ok) {
                throw new Error('找不到 data.xlsx 檔案');
            }
            
            const arrayBuffer = await response.arrayBuffer();
            
            // Process it like a regular file
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            console.log('Reading sheet:', firstSheetName);
            
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: '',
                blankrows: false
            });
            
            if (jsonData.length < 2) {
                throw new Error('檔案中沒有足夠的資料');
            }
            
            // Parse into structured format
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            console.log('Found columns:', headers);
            console.log('Found', rows.length, 'rows of data');
            
            // Convert rows to objects
            const objectData = rows.map((row, index) => {
                const obj = { _rowIndex: index + 2 };
                headers.forEach((header, colIndex) => {
                    obj[header] = row[colIndex] || '';
                });
                return obj;
            });
            
            this.data = {
                headers: headers,
                rows: objectData,
                raw: jsonData
            };
            
            this.fileName = 'data.xlsx';
            return this.data;
            
        } catch (error) {
            console.error('Error loading default file:', error);
            throw new Error('無法載入預設檔案: ' + error.message);
        }
    }

    /**
     * Get the loaded data
     */
    getData() {
        return this.data;
    }

    /**
     * Get specific column values (with multiple name support)
     */
    getColumn(columnNames) {
        if (!this.data || !this.data.rows) return [];
        
        // Convert to array if single string
        const names = Array.isArray(columnNames) ? columnNames : [columnNames];
        
        return this.data.rows.map(row => {
            // Try each possible column name
            for (const name of names) {
                if (row[name] !== undefined && row[name] !== '') {
                    return row[name];
                }
            }
            return '';
        });
    }

    /**
     * Get value from row (try multiple column names)
     */
    getValue(row, columnNames) {
        const names = Array.isArray(columnNames) ? columnNames : [columnNames];
        
        for (const name of names) {
            if (row[name] !== undefined && row[name] !== '') {
                return row[name];
            }
        }
        return '';
    }

    /**
     * Print data summary to console (for debugging)
     */
    printSummary() {
        if (!this.data) {
            console.log('No data loaded');
            return;
        }
        
        console.log('=== Data Summary ===');
        console.log('File:', this.fileName);
        console.log('Columns:', this.data.headers);
        console.log('Total Rows:', this.data.rows.length);
        console.log('First Row:', this.data.rows[0]);
        console.log('Last Row:', this.data.rows[this.data.rows.length - 1]);
        
        // Show column statistics
        console.log('\n=== Column Statistics ===');
        this.data.headers.forEach(header => {
            const values = this.getColumn(header);
            const nonEmpty = values.filter(v => v !== '').length;
            console.log(`${header}: ${nonEmpty}/${values.length} non-empty values`);
        });
    }
}

// Create global instance
const dataLoader = new DataLoader();