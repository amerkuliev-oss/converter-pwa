// Загрузка единиц при выборе категории
document.getElementById('category').addEventListener('change', function() {
    const category = this.value;
    
    fetch(`/api/units/${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(units => {
            const fromSelect = document.getElementById('fromUnit');
            const toSelect = document.getElementById('toUnit');
            
            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';
            
            units.forEach(unit => {
                const option1 = document.createElement('option');
                option1.value = unit;
                option1.textContent = unit;
                fromSelect.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = unit;
                option2.textContent = unit;
                toSelect.appendChild(option2);
            });
            
            // Выбираем разные единицы по умолчанию
            if (units.length > 1) {
                fromSelect.selectedIndex = 0;
                toSelect.selectedIndex = 1;
            }
            
            convert();
        });
});

// Конвертация
function convert() {
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const value = parseFloat(document.getElementById('inputValue').value);
    
    if (isNaN(value)) {
        document.getElementById('result').textContent = 'Введите число';
        return;
    }
    
    fetch('/api/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: category,
            from_unit: fromUnit,
            to_unit: toUnit,
            value: value
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = data.result;
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById('result').textContent = 'Ошибка';
    });
}

// Кнопка конвертации
document.getElementById('convertBtn').addEventListener('click', convert);

// Поменять местами
document.getElementById('swapBtn').addEventListener('click', function() {
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    const inputValue = document.getElementById('inputValue');
    const result = document.getElementById('result');
    
    // Меняем единицы
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    // Меняем значения
    if (result.textContent && !isNaN(parseFloat(result.textContent))) {
        inputValue.value = result.textContent;
    }
    
    convert();
});

// Очистка
document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('inputValue').value = '1.0';
    document.getElementById('result').textContent = '0';
});

// Автоконвертация при изменении
document.getElementById('inputValue').addEventListener('input', convert);
document.getElementById('fromUnit').addEventListener('change', convert);
document.getElementById('toUnit').addEventListener('change', convert);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('category').dispatchEvent(new Event('change'));
});