// main.js - Simplified Main Controller (Manual Upload Only)

// Application state
const app = {
    data: null,
    isLoaded: false
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Excel Loader Ready - Manual Upload Only');
    setupEventListeners();
});

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // File input change event
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
        console.log('File input listener attached');
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
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    console.log('File selected:', file.name);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);
    
    // Check file type
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showError('請選擇 Excel 檔案 (.xlsx 或 .xls)');
        return;
    }
    
    // Load the Excel file
    await loadExcelFile(file);
}

/**
 * Load Excel file
 */
async function loadExcelFile(file) {
    console.log('Starting to load file...');
    showLoading(true);
    hideMessages();
    
    try {
        // Check if dataLoader exists
        if (typeof dataLoader === 'undefined') {
            throw new Error('dataLoader is not defined. Check if dataLoader.js is loaded correctly.');
        }
        
        console.log('dataLoader found, loading file...');
        
        // Load the file using dataLoader
        const data = await dataLoader.loadFromFile(file);
        
        // Store in app state
        app.data = data;
        app.isLoaded = true;
        
        console.log('✅ File loaded successfully!');
        console.log('Columns found:', data.headers);
        console.log('Rows found:', data.rows.length);
        
        // Show success message
        showSuccess(`成功載入 ${file.name} - ${data.rows.length} 筆資料`);
        
        // Display data summary
        displayDataSummary(file.name);
        
        // Print summary to console for debugging
        if (typeof dataLoader.printSummary === 'function') {
            dataLoader.printSummary();
        }
        
    } catch (error) {
        console.error('❌ Error loading file:', error);
        showError('載入失敗: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Display data summary
 */
function displayDataSummary(fileName) {
    if (!app.data) {
        console.log('No data to display');
        return;
    }
    
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
    console.log('📊 Data Preview:');
    console.log('Headers:', app.data.headers);
    console.log('First 3 rows:');
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
    // Get loaded data
    getData: () => app.data,
    
    // Get headers
    getHeaders: () => app.data ? app.data.headers : null,
    
    // Get rows
    getRows: () => app.data ? app.data.rows : null,
    
    // Get specific row
    getRow: (index) => app.data ? app.data.rows[index] : null,
    
    // Search columns by name
    searchColumn: (name) => {
        if (!app.data) return 'No data loaded';
        return app.data.headers.filter(h => h.includes(name));
    },
    
    // Get app state
    getState: () => app,
    
    // Check if dataLoader exists
    checkLoader: () => {
        console.log('DataLoader class:', typeof DataLoader);
        console.log('dataLoader instance:', typeof dataLoader);
        if (typeof dataLoader !== 'undefined') {
            console.log('dataLoader object:', dataLoader);
        }
    }
};

// Log initialization
console.log('main.js loaded successfully');
console.log('Type debugApp.checkLoader() to verify dataLoader');