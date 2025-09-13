// main.js - Main Controller with Student Object Processing

// Application state
const app = {
    data: null,
    students: {},  // Will store student objects
    isLoaded: false
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // File input change event
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
        console.log('========== User uploaded file ===========');
    }
    
    // Reload button
    const reloadBtn = document.getElementById('reloadBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }
}

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

async function loadExcelFile(file) {
    console.log('Starting to load file...');
    showLoading(true);
    hideMessages();
    
    try {   
        // console.log('dataLoader found, loading file...');
        
        // Load the file using dataLoader
        const data = await dataLoader.loadFromFile(file);
        
        // Store raw data
        app.data = data;
        app.isLoaded = true;
        
        console.log('✅ File loaded successfully!');
        console.log('Columns found:', data.headers);
        console.log('Rows found:', data.rows.length);
        
        // Process students
        processStudents(data);
        
        // Show success message
        const studentCount = Object.keys(app.students).length;
        showSuccess(`成功載入 ${file.name} - ${data.rows.length} 筆資料, ${studentCount} 位學生`);
        
        // Display data summary
        displayDataSummary(file.name);
        
        // Display student summary
        displayStudentSummary();
        
    } catch (error) {
        console.error('❌ Error loading file:', error);
        showError('載入失敗: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function processStudents(data) {
    console.log('📚 Processing student data...');
    
    // Reset students object
    app.students = {};

    // First row contains headers (column names)
    const headers = data.headers;
    
    // Find the column index for student name
    const studentNameColumns = ['學生姓名', 'Student Name', 'Student', '姓名', 'Name'];
    let studentNameColumn = null;
    
    // Find which column name exists in the data
    for (const possibleName of studentNameColumns) {
        if (headers.includes(possibleName)) {
            studentNameColumn = possibleName;
            break;
        }
    }
    
    if (!studentNameColumn) {
        console.warn('Warning: Could not find student name column');
        console.log('Available columns:', headers);
        return;
    }
    
    console.log(`Found student name column: "${studentNameColumn}"`);
    
    // Process each row
    data.rows.forEach((row, index) => {
        const studentName = row[studentNameColumn];
        
        // Skip if no student name
        if (!studentName || studentName.trim() === '') {
            console.log(`Skipping row ${index + 1}: No student name`);
            return;
        }
        
        // Create student object if doesn't exist
        app.students[studentName] = row;
        console.log(`Student ${index + 1}: ${studentName}`);
    });
    
    console.log(`✅ Processed ${Object.keys(app.students).length} students`);
    console.log('Students:', app.students);
}

/**
 * Extract scores from a row
 */
function extractScores(student, row) {
    // Extract each type of score

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
}

/**
 * Display student summary
 */
function displayStudentSummary() {
    console.log('📊 Student Summary:');
    console.log('=================');
    
    const students = Object.values(app.students);
    
    // Sort by name
    students.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
    
    students.forEach(student => {
        console.log(`\n👤 ${student.name}:`);
        console.log(`   觀察次數: ${student.observationCount}`);
        console.log(`   情緒穩定: ${student.averages.emotional}`);
        console.log(`   專注力: ${student.averages.focus}`);
        console.log(`   社交互動: ${student.averages.social}`);
        console.log(`   整體平均: ${student.overallAverage}`);
        console.log(`   進步率: ${student.progress}%`);
        console.log(`   志工: ${student.volunteerList.join(', ') || 'N/A'}`);
    });
    
    // Overall statistics
    console.log('\n📈 Overall Statistics:');
    console.log('=====================');
    console.log(`Total Students: ${students.length}`);
    console.log(`Total Observations: ${app.data.rows.length}`);
    console.log(`Average Observations per Student: ${(app.data.rows.length / students.length).toFixed(1)}`);
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
    // Get all data
    getData: () => app.data,
    
    // Get all students
    getStudents: () => app.students,
    
    // Get specific student
    getStudent: (name) => app.students[name],
    
    // List all student names
    listStudents: () => Object.keys(app.students),
    
    // Get student stats
    getStudentStats: (name) => {
        const student = app.students[name];
        if (!student) return 'Student not found';
        return {
            name: student.name,
            observations: student.observationCount,
            averages: student.averages,
            overall: student.overallAverage,
            progress: student.progress,
            volunteers: student.volunteerList
        };
    },
    
    // Get top performers
    getTopStudents: (n = 5) => {
        return Object.values(app.students)
            .sort((a, b) => b.overallAverage - a.overallAverage)
            .slice(0, n)
            .map(s => ({
                name: s.name,
                average: s.overallAverage,
                progress: s.progress
            }));
    },
    
    // Get students needing attention
    getNeedsAttention: (threshold = 3) => {
        return Object.values(app.students)
            .filter(s => s.overallAverage < threshold)
            .map(s => ({
                name: s.name,
                average: s.overallAverage,
                observations: s.observationCount
            }));
    },
    
    // Get app state
    getState: () => app
};

// Log initialization
console.log('main.js loaded successfully');
console.log('After loading a file, use:');
console.log('  debugApp.listStudents() - See all student names');
console.log('  debugApp.getStudent("name") - Get specific student data');
console.log('  debugApp.getTopStudents() - See top performers');
console.log('  debugApp.getNeedsAttention() - See students who need help');