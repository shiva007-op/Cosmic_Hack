from fastapi import APIRouter, Query
from app.neos.nasa_client import (
    fetch_today_asteroids,
    fetch_past_asteroids,
    fetch_month_asteroids,
)
from app.risk.scorer import calculate_risk

router = APIRouter()


def normalize_results(data):
    results = []

    for date_key, neos in data.get("near_earth_objects", {}).items():
        for neo in neos:
            if not neo.get("close_approach_data"):
                continue

            approach = neo["close_approach_data"][0]

            results.append({
                "id": neo["id"],
                "name": neo["name"],
                "date": approach["close_approach_date"],
                "diameter_m": round(
                    neo["estimated_diameter"]["meters"]["estimated_diameter_max"], 2
                ),
                "miss_distance_km": round(
                    float(approach["miss_distance"]["kilometers"]), 2
                ),
                "velocity_km_s": round(
                    float(approach["relative_velocity"]["kilometers_per_second"]), 2
                ),
                "risk": calculate_risk(neo),
            })

    return results


@router.get("/today")
def today_asteroids():
    data = fetch_today_asteroids()
    return normalize_results(data)


@router.get("/history")
def history_asteroids(days: int = Query(7, ge=1, le=30)):
    """
    Past N days NEO data
    """
    data = fetch_past_asteroids(days)
    return normalize_results(data)


@router.get("/calendar")
def calendar_asteroids(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
):
    """
    Full month NEO data (calendar view)
    """
    data = fetch_month_asteroids(year, month)
    return normalize_results(data)
