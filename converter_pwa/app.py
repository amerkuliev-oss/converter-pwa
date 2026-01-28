from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Конфигурация для PWA
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 3600  # Кэширование 1 час

# Ваша логика конвертации (вставьте из предыдущих шагов)
CONVERSION_RATES = {
    "Длина": {"Метр": 1.0, "Километр": 1000.0, "Сантиметр": 0.01, "Миллиметр": 0.001},
    "Вес": {"Килограмм": 1.0, "Грамм": 0.001, "Фунт": 0.453592},
    "Объём": {"Литр": 1.0, "Миллилитр": 0.001},
    "Температура": {"Цельсий": "c", "Фаренгейт": "f", "Кельвин": "k"}
}

@app.route('/')
def index():
    return render_template('index.html', categories=list(CONVERSION_RATES.keys()))

@app.route('/api/units/<category>')
def get_units(category):
    return jsonify(list(CONVERSION_RATES.get(category, {}).keys()))

@app.route('/api/convert', methods=['POST'])
def convert():
    try:
        data = request.json
        # Ваша логика конвертации
        return jsonify({'result': 0.001})  # Заглушка
    except:
        return jsonify({'error': 'Conversion error'}), 400

@app.route('/service-worker.js')
def service_worker():
    return app.send_static_file('sw.js')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

# Обработка для SPA (чтобы работали прямые ссылки)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path and not path.startswith('api') and not path.startswith('static'):
        return render_template('index.html')
    return "Not Found", 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)