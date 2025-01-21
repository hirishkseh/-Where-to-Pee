from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/get_optimal_position', methods=['POST'])
def get_optimal_position():
    data = request.json
    urinals = data.get('urinals', [])
    n = len(urinals)

    if not urinals:
        return jsonify({"message": "No urinals provided. Go find a tree!"})

    # Find the optimal urinal
    best_position = -1
    max_distance = -1

    for i in range(n):
        if urinals[i] == 0:
            distance = min((abs(i - j) for j in range(n) if urinals[j] == 1), default=n)
            if distance > max_distance:
                max_distance = distance
                best_position = i

    if best_position == -1:
        return jsonify({"message": "All urinals are occupied. Try the sink or hold it."})

    return jsonify({"position": best_position})

if __name__ == '__main__':
    app.run(debug=True)
