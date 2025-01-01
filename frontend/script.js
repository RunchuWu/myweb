const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';  // Replace with actual DeepSeek API endpoint

class FortuneCalculator {
    constructor() {
        this.userData = {};
    }

    calculateBaZi(birthDateTime) {
        // Implement BaZi calculation logic
        const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        
        // This is a simplified calculation - you'd want to implement proper lunar calendar conversion
        const year = birthDateTime.getFullYear();
        const month = birthDateTime.getMonth();
        const day = birthDateTime.getDate();
        const hour = birthDateTime.getHours();

        return {
            year: heavenlyStems[year % 10] + earthlyBranches[year % 12],
            month: heavenlyStems[month % 10] + earthlyBranches[month % 12],
            day: heavenlyStems[day % 10] + earthlyBranches[day % 12],
            hour: heavenlyStems[hour % 10] + earthlyBranches[hour % 12]
        };
    }

    async getFortune(method) {
        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: method,
                    userData: this.userData
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to generate fortune');
        }
    }

    generatePrompt(method) {
        const { birthDate, birthPlace, gender, category, question } = this.userData;
        
        let prompt = `Based on the following information:\n`;
        prompt += `Birth: ${birthDate}\n`;
        prompt += `Location: ${birthPlace}\n`;
        prompt += `Gender: ${gender}\n`;
        prompt += `Question Category: ${category}\n`;
        prompt += `Specific Question: ${question}\n\n`;

        switch(method) {
            case 'bazi':
                const baziChart = this.calculateBaZi(new Date(birthDate));
                prompt += `Using the BaZi chart:\n`;
                prompt += `Year Pillar: ${baziChart.year}\n`;
                prompt += `Month Pillar: ${baziChart.month}\n`;
                prompt += `Day Pillar: ${baziChart.day}\n`;
                prompt += `Hour Pillar: ${baziChart.hour}\n`;
                break;
            case 'yijing':
                prompt += `Please provide a Yi Jing reading with hexagram interpretation.\n`;
                break;
            case 'bagua':
                prompt += `Please provide a BaGua analysis considering the person's birth direction and current situation.\n`;
                break;
        }

        return prompt;
    }
}

// Initialize the application
const fortuneCalculator = new FortuneCalculator();
let currentStep = 1;

// Event Listeners
document.getElementById('personalInfoForm').addEventListener('submit', handlePersonalInfo);
document.getElementById('methodForm').addEventListener('submit', handleMethod);
document.getElementById('questionForm').addEventListener('submit', handleQuestion);
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateStep(currentStep - 1));
});
document.querySelectorAll('.method-card').forEach(card => {
    card.addEventListener('click', handleMethodSelection);
});
document.getElementById('newReading').addEventListener('click', resetForm);

// ... Add the rest of the event handler functions and navigation logic ... 

document.addEventListener('DOMContentLoaded', function() {
    // Populate year dropdown (100 years back from current year)
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Populate days dropdown
    const daySelect = document.getElementById('birthDay');
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
    }

    // Populate hours dropdown (24-hour format)
    const hourSelect = document.getElementById('birthHour');
    for (let hour = 0; hour < 24; hour++) {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour.toString().padStart(2, '0');
        hourSelect.appendChild(option);
    }

    // Populate minutes dropdown
    const minuteSelect = document.getElementById('birthMinute');
    for (let minute = 0; minute < 60; minute++) {
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute.toString().padStart(2, '0');
        minuteSelect.appendChild(option);
    }

    // Update days in month when month changes
    document.getElementById('birthMonth').addEventListener('change', updateDays);
    document.getElementById('birthYear').addEventListener('change', updateDays);
});

function updateDays() {
    const year = document.getElementById('birthYear').value;
    const month = document.getElementById('birthMonth').value;
    const daySelect = document.getElementById('birthDay');
    const selectedDay = daySelect.value;
    
    // Clear current days
    daySelect.innerHTML = '<option value="">Day</option>';
    
    if (year && month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
        
        // Restore selected day if it's still valid
        if (selectedDay && selectedDay <= daysInMonth) {
            daySelect.value = selectedDay;
        }
    }
} 

// Add this new calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedMonth = null;
        this.selectedYear = null;
        
        this.initializeYearSelect();
        this.initializeEventListeners();
        this.renderCalendar();
    }

    initializeYearSelect() {
        const yearSelect = document.getElementById('yearSelect');
        const currentYear = new Date().getFullYear();
        
        // Add years (100 years back from current year)
        for (let year = currentYear - 100; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        yearSelect.value = currentYear;
    }

    initializeEventListeners() {
        document.getElementById('prevYear').addEventListener('click', () => {
            const yearSelect = document.getElementById('yearSelect');
            if (yearSelect.selectedIndex > 0) {
                yearSelect.selectedIndex--;
                this.renderCalendar();
            }
        });

        document.getElementById('nextYear').addEventListener('click', () => {
            const yearSelect = document.getElementById('yearSelect');
            if (yearSelect.selectedIndex < yearSelect.options.length - 1) {
                yearSelect.selectedIndex++;
                this.renderCalendar();
            }
        });

        document.getElementById('yearSelect').addEventListener('change', () => {
            this.renderCalendar();
        });

        // Month selection
        document.querySelectorAll('.month').forEach(monthEl => {
            monthEl.addEventListener('click', (e) => {
                const month = parseInt(e.target.dataset.month);
                this.selectMonth(month);
            });
        });
    }

    selectMonth(month) {
        document.querySelectorAll('.month').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-month="${month}"]`).classList.add('selected');
        
        this.selectedMonth = month - 1;
        this.renderCalendar();
    }

    renderCalendar() {
        const year = parseInt(document.getElementById('yearSelect').value);
        const month = this.selectedMonth !== null ? this.selectedMonth : this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const calendarDays = document.querySelector('.calendar-days');
        calendarDays.innerHTML = '';
        
        // Add days from previous month
        const firstDayIndex = firstDay.getDay();
        for (let i = firstDayIndex; i > 0; i--) {
            const day = new Date(year, month, -i + 1);
            this.createDayElement(calendarDays, day, true);
        }
        
        // Add days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            this.createDayElement(calendarDays, date);
        }
        
        // Add days from next month
        const lastDayIndex = lastDay.getDay();
        for (let i = 1; i < 7 - lastDayIndex; i++) {
            const date = new Date(year, month + 1, i);
            this.createDayElement(calendarDays, date, true);
        }
    }

    createDayElement(container, date, isOtherMonth = false) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        if (isOtherMonth) dayElement.classList.add('other-month');
        
        dayElement.textContent = date.getDate();
        dayElement.addEventListener('click', () => this.selectDate(date));
        
        if (this.selectedDate && 
            date.getDate() === this.selectedDate.getDate() &&
            date.getMonth() === this.selectedDate.getMonth() &&
            date.getFullYear() === this.selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        container.appendChild(dayElement);
    }

    selectDate(date) {
        this.selectedDate = date;
        this.selectedYear = date.getFullYear();
        this.selectedMonth = date.getMonth();
        
        // Update the calendar display
        this.renderCalendar();
        
        // You can add a callback here to handle the date selection
        console.log('Selected date:', date);
    }
}

// Initialize the calendar when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
}); 