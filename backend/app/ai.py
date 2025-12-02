def analyze_complaint(text: str) -> dict:
    """
    Very simple rule-based AI:
    - Looks for keywords to decide category, priority, sentiment, team.
    - In real life, this could be replaced with ML/NLP model.
    """
    lower = text.lower()

    # category
    if "refund" in lower or "return" in lower or "money back" in lower:
        category = "Refund Issue"
        team = "Billing / Refunds Team"
    elif "payment" in lower or "card" in lower or "upi" in lower:
        category = "Payment Issue"
        team = "Payments Team"
    elif "delivery" in lower or "late" in lower or "delay" in lower:
        category = "Delivery Issue"
        team = "Logistics Team"
    elif "login" in lower or "password" in lower or "account" in lower:
        category = "Login / Account Issue"
        team = "Technical Support Team"
    elif "broken" in lower or "damaged" in lower or "quality" in lower:
        category = "Product Quality Issue"
        team = "Quality & Returns Team"
    else:
        category = "General Query"
        team = "General Support Team"

    # priority
    if any(w in lower for w in ["fraud", "scam", "unauthorized", "not received", "never received"]):
        priority = "High"
    elif any(w in lower for w in ["angry", "upset", "disappointed", "escalate"]):
        priority = "High"
    elif any(w in lower for w in ["issue", "problem", "error", "not working"]):
        priority = "Medium"
    else:
        priority = "Low"

    # sentiment (very rough)
    if any(w in lower for w in ["angry", "worst", "terrible", "useless", "hate"]):
        sentiment = "Very Negative"
    elif any(w in lower for w in ["not happy", "bad", "disappointed"]):
        sentiment = "Negative"
    elif any(w in lower for w in ["great", "good", "love", "awesome"]):
        sentiment = "Positive"
    else:
        sentiment = "Neutral"

    return {
        "category": category,
        "sentiment": sentiment,
        "priority": priority,
        "assigned_team": team,
    }
