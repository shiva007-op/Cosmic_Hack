def calculate_risk(neo):
    score = 0

    if neo["is_potentially_hazardous_asteroid"]:
        score += 40

    diameter = neo["estimated_diameter"]["meters"]["estimated_diameter_max"]
    if diameter > 500:
        score += 30

    approach = neo["close_approach_data"][0]
    miss_km = float(approach["miss_distance"]["kilometers"])
    velocity = float(approach["relative_velocity"]["kilometers_per_second"])

    if miss_km < 1_000_000:
        score += 20

    if velocity > 25:
        score += 10

    level = (
        "High" if score > 60 else
        "Moderate" if score > 30 else
        "Low"
    )

    return {
        "score": score,
        "level": level
    }
