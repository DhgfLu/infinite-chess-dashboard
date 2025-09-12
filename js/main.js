// main.js - Simplified Main Controller for File Upload Only

// Application state
const app = {
    data: null,
    isLoaded: false
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Excel Loader Ready');
    setupEventListeners();
});

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // File input change
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Load default button
    const loadDefaultBtn = document.getElementById('loadDefaultBtn');
    if (loadDefaultBtn) {
        loadDefaultBtn.addEventListener('click', loadDefaultData);
    }
    
    // Reload button
    const reloadBtn = document.getElementById('reloadBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

/**
 * Handle file selection
 */
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name);
    
    // Check file type
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showError('請選擇 Excel 檔案 (.xlsx 或 .xls)');
        return;
    }
    
    await loadExcelFile(file);
}

/**
 * Load Excel file
 */
async function loadExcelFile(file) {
    showLoading(true);
    hideMessages();
    
    try {
        console.log('Loading file...');
        alert("typeof DataLoader", typeof DataLoader);  
        alert(typeof dataLoader);  
        alert(dataLoader);



        
        // Load the file using dataLoader
        const data = await dataLoader.loadFromFile(file);
        
        // Store in app state
        app.data = data;
        app.isLoaded = true;
        
        console.log('File loaded successfully!');
        console.log('Columns found:', data.headers);
        console.log('Rows found:', data.rows.length);
        
        // Show success message
        showSuccess(`成功載入 ${file.name}`);
        
        // Display data summary
        displayDataSummary(file.name);
        
        // Print to console for debugging
        dataLoader.printSummary();
        
    } catch (error) {
        console.error('Error loading file:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Load default test.xlsx
 */
async function loadDefaultData() {
    showLoading(true);
    hideMessages();
    
    try {
        console.log('Loading default test.xlsx...');
        
        // Try to load test.xlsx from same folder
        const response = await fetch('test.xlsx');
        
        if (!response.ok) {
            throw new Error('找不到 test.xlsx 檔案');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Create a File object from the arrayBuffer
        const file = new File([arrayBuffer], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Use the same loadFromFile method
        const data = await dataLoader.loadFromFile(file);
        
        // Store in app state
        app.data = data;
        app.isLoaded = true;
        
        console.log('Default file loaded successfully!');
        
        // Show success message
        showSuccess('成功載入 test.xlsx');
        
        // Display data summary
        displayDataSummary('test.xlsx');
        
        // Print to console
        dataLoader.printSummary();
        
    } catch (error) {
        console.error('Error loading default file:', error);
        showError('無法載入 test.xlsx: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Display data summary
 */
function displayDataSummary(fileName) {
    if (!app.data) return;
    
    // Show summary section
    const summaryDiv = document.getElementById('dataSummary');
    if (summaryDiv) {
        summaryDiv.classList.remove('hidden');
    }
    
    // Update counts
    updateElement('rowCount', app.data.rows.length);
    updateElement('colCount', app.data.headers.length);
    updateElement('fileName', fileName);
    
    // Display column list
    const columnList = document.getElementById('columnList');
    if (columnList) {
        columnList.innerHTML = app.data.headers
            .map(header => `
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    ${header}
                </span>
            `).join('');
    }
    
    // Log first few rows for debugging
    console.log('First 3 rows of data:');
    app.data.rows.slice(0, 3).forEach((row, index) => {
        console.log(`Row ${index + 1}:`, row);
    });
}

// ========== UI Helper Functions ==========

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('fileError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('fileSuccess');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
    }
}

function hideMessages() {
    const errorDiv = document.getElementById('fileError');
    const successDiv = document.getElementById('fileSuccess');
    if (errorDiv) errorDiv.classList.add('hidden');
    if (successDiv) successDiv.classList.add('hidden');
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// ========== Debug Functions ==========

window.debugApp = {
    getData: () => app.data,
    getHeaders: () => app.data ? app.data.headers : null,
    getRows: () => app.data ? app.data.rows : null,
    getFirstRow: () => app.data ? app.data.rows[0] : null,
    searchColumn: (name) => {
        if (!app.data) return 'No data loaded';
        return app.data.headers.filter(h => h.includes(name));
    }
};