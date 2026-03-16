"""Seed script to populate the database with mock data for demonstration."""
from database import SessionLocal, engine, Base
from auth import get_password_hash
from datetime import datetime, timedelta
import models
import random

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed():
    # Check if data exists
    if db.query(models.User).first():
        print("Database already seeded!")
        return
    
    print("Seeding database...")
    
    # --- Users ---
    users = []
    for uname, email, fname in [
        ("student1", "student1@example.com", "Alex Johnson"),
        ("student2", "student2@example.com", "Priya Sharma"),
        ("demo", "demo@example.com", "Demo User"),
    ]:
        u = models.User(username=uname, email=email, full_name=fname, hashed_password=get_password_hash("password123"))
        db.add(u)
        users.append(u)
    db.commit()
    for u in users:
        db.refresh(u)
    
    demo = users[2]
    
    # --- Streaks ---
    streak = models.Streak(user_id=demo.id, current_streak=12, longest_streak=25, total_points=340,
                           last_activity_date=datetime.utcnow())
    db.add(streak)
    
    # --- Badges ---
    badge_data = [
        ("First Steps", "Complete your first study session", "🎯"),
        ("7-Day Warrior", "Maintained a 7-day study streak", "🔥"),
        ("Problem Solver", "Solved 10 practice problems", "💡"),
        ("Test Taker", "Complete your first mock test", "📝"),
        ("Resource Collector", "Upload 5 study resources", "📚"),
        ("Monthly Master", "Maintained a 30-day study streak", "🏆"),
        ("Mock Test Master", "Score above 80% in 3 tests", "🌟"),
    ]
    badges = []
    for name, desc, icon in badge_data:
        b = models.Badge(name=name, description=desc, icon=icon)
        db.add(b)
        badges.append(b)
    db.commit()
    for b in badges:
        db.refresh(b)
    
    # Award some badges to demo
    for b in badges[:4]:
        db.add(models.UserBadge(user_id=demo.id, badge_id=b.id))
    
    # --- Study Schedules ---
    schedule = models.StudySchedule(
        user_id=demo.id, title="Mid-Semester Exam Prep",
        exam_date=datetime.utcnow() + timedelta(days=21),
        hours_per_day=5.0, priority_subjects=["Data Structures", "DBMS"]
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    
    subjects = ["Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Aptitude"]
    for i in range(14):
        subj = subjects[i % len(subjects)]
        task = models.ScheduleTask(
            schedule_id=schedule.id,
            title=f"Study {subj} - Chapter {(i // len(subjects)) + 1}",
            description=f"Cover core concepts of {subj}",
            subject=subj, date=datetime.utcnow() + timedelta(days=i),
            duration_hours=2.0, is_completed=i < 5,
            priority="high" if subj in ["Data Structures", "DBMS"] else "medium"
        )
        db.add(task)
    
    schedule2 = models.StudySchedule(
        user_id=demo.id, title="Placement Preparation",
        interview_date=datetime.utcnow() + timedelta(days=45),
        hours_per_day=3.0, priority_subjects=["DSA", "System Design"]
    )
    db.add(schedule2)
    db.commit()
    db.refresh(schedule2)
    
    for i in range(10):
        subj = ["DSA", "System Design", "Aptitude", "HR Prep"][i % 4]
        db.add(models.ScheduleTask(
            schedule_id=schedule2.id, title=f"{subj} Practice",
            subject=subj, date=datetime.utcnow() + timedelta(days=i + 14),
            duration_hours=1.5, is_completed=False, priority="high" if subj == "DSA" else "medium"
        ))
    
    # --- Resources ---
    resources_data = [
        ("Data Structures Notes", "Comprehensive DS notes", "link", "notes", "Data Structures", "https://www.geeksforgeeks.org/data-structures/", ["ds", "algorithms"]),
        ("LeetCode - Top 100", "Must-do coding problems", "link", "coding", "DSA", "https://leetcode.com/problemset/", ["leetcode", "coding"]),
        ("DBMS Complete Guide", "Database management system notes", "link", "notes", "DBMS", "https://www.javatpoint.com/dbms-tutorial", ["dbms", "sql"]),
        ("Aptitude Practice Set", "Quantitative aptitude problems", "link", "aptitude", "Aptitude", "https://www.indiabix.com/", ["quantitative", "aptitude"]),
        ("OS Concepts", "Operating systems study material", "link", "notes", "Operating Systems", "https://www.tutorialspoint.com/operating_system/", ["os", "processes"]),
        ("System Design Primer", "System design interview prep", "link", "interview", "System Design", "https://github.com/donnemartin/system-design-primer", ["system-design", "interview"]),
        ("HackerRank Challenges", "Coding challenges platform", "link", "coding", "DSA", "https://www.hackerrank.com/", ["hackerrank", "practice"]),
        ("CN Fundamentals", "Computer Networks basics", "link", "notes", "Computer Networks", "https://www.geeksforgeeks.org/computer-network-tutorials/", ["networking", "protocols"]),
    ]
    for title, desc, rtype, cat, subj, url, tags in resources_data:
        db.add(models.Resource(user_id=demo.id, title=title, description=desc, resource_type=rtype, category=cat, subject=subj, url=url, tags=tags))
    
    # --- Subject Progress ---
    progress_data = [
        ("Data Structures", [("Arrays", "mastered"), ("Linked Lists", "mastered"), ("Trees", "practicing"), ("Graphs", "learning"), ("Dynamic Programming", "not_started"), ("Hashing", "mastered")]),
        ("DBMS", [("ER Model", "mastered"), ("Normalization", "practicing"), ("SQL Queries", "mastered"), ("Transactions", "learning"), ("Indexing", "not_started")]),
        ("Operating Systems", [("Process Management", "mastered"), ("Memory Management", "learning"), ("File Systems", "not_started"), ("Deadlocks", "practicing")]),
        ("Aptitude", [("Number Systems", "mastered"), ("Percentages", "mastered"), ("Time & Work", "practicing"), ("Probability", "learning"), ("Permutations", "not_started")]),
    ]
    for subj, topics in progress_data:
        completed = sum(1 for _, s in topics if s == "mastered")
        sp = models.SubjectProgress(user_id=demo.id, subject=subj, total_topics=len(topics), completed_topics=completed,
                                    target_date=datetime.utcnow() + timedelta(days=30))
        db.add(sp)
        db.commit()
        db.refresh(sp)
        for tname, tstatus in topics:
            db.add(models.TopicProgress(subject_progress_id=sp.id, topic_name=tname, status=tstatus))
    
    # --- Mock Tests ---
    tests = [
        {
            "title": "Data Structures Quiz 1",
            "description": "Test your knowledge of arrays, linked lists, and stacks",
            "test_type": "subject", "subject": "Data Structures", "difficulty": "medium",
            "duration_minutes": 20, "total_marks": 50,
            "questions": [
                {"id": 1, "question": "What is the time complexity of accessing an element in an array by index?", "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"], "correct_answer": "O(1)"},
                {"id": 2, "question": "Which data structure uses LIFO principle?", "options": ["Queue", "Stack", "Array", "Linked List"], "correct_answer": "Stack"},
                {"id": 3, "question": "What is the worst case time complexity of searching in a BST?", "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"], "correct_answer": "O(n)"},
                {"id": 4, "question": "Which traversal of a BST gives sorted output?", "options": ["Preorder", "Inorder", "Postorder", "Level order"], "correct_answer": "Inorder"},
                {"id": 5, "question": "A complete binary tree with n nodes has height?", "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correct_answer": "O(log n)"},
            ]
        },
        {
            "title": "Aptitude Test - Quantitative",
            "description": "Practice quantitative aptitude for placements",
            "test_type": "aptitude", "subject": "Aptitude", "difficulty": "easy",
            "duration_minutes": 15, "total_marks": 40,
            "questions": [
                {"id": 1, "question": "If 20% of a number is 80, what is the number?", "options": ["200", "400", "300", "500"], "correct_answer": "400"},
                {"id": 2, "question": "A train 200m long passes a pole in 10 seconds. What is its speed in km/h?", "options": ["72", "60", "54", "80"], "correct_answer": "72"},
                {"id": 3, "question": "The ratio 2:5 is equivalent to?", "options": ["4:10", "3:6", "5:10", "6:12"], "correct_answer": "4:10"},
                {"id": 4, "question": "What is 15% of 300?", "options": ["30", "45", "50", "35"], "correct_answer": "45"},
            ]
        },
        {
            "title": "DBMS Fundamentals",
            "description": "Test your database concepts",
            "test_type": "subject", "subject": "DBMS", "difficulty": "medium",
            "duration_minutes": 25, "total_marks": 50,
            "questions": [
                {"id": 1, "question": "Which normal form eliminates transitive dependency?", "options": ["1NF", "2NF", "3NF", "BCNF"], "correct_answer": "3NF"},
                {"id": 2, "question": "ACID stands for?", "options": ["Atomicity, Consistency, Isolation, Durability", "Automatic, Consistent, Isolated, Durable", "Atomicity, Compact, Isolation, Durability", "None"], "correct_answer": "Atomicity, Consistency, Isolation, Durability"},
                {"id": 3, "question": "Which SQL command is used to remove a table?", "options": ["DELETE", "DROP", "REMOVE", "TRUNCATE"], "correct_answer": "DROP"},
                {"id": 4, "question": "A foreign key references what in another table?", "options": ["Foreign key", "Primary key", "Candidate key", "Super key"], "correct_answer": "Primary key"},
                {"id": 5, "question": "Which join returns all rows from both tables?", "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], "correct_answer": "FULL OUTER JOIN"},
            ]
        },
    ]
    for t in tests:
        db.add(models.MockTest(**t))
    db.commit()
    
    # --- Test Submissions (history) ---
    all_tests = db.query(models.MockTest).all()
    for t in all_tests:
        for days_ago in [7, 3]:
            score = random.uniform(50, 95)
            db.add(models.TestSubmission(
                user_id=demo.id, test_id=t.id,
                answers={str(q["id"]): q["correct_answer"] if random.random() > 0.3 else q["options"][0] for q in t.questions},
                score=round(score, 1), total_marks=t.total_marks,
                accuracy=round(score / t.total_marks * 100, 1),
                time_taken_minutes=random.uniform(10, t.duration_minutes),
                submitted_at=datetime.utcnow() - timedelta(days=days_ago)
            ))
    
    # --- Readiness Check-ins ---
    for subj, conf in [("Data Structures", 4), ("DBMS", 3), ("Operating Systems", 2), ("Aptitude", 4), ("System Design", 1)]:
        db.add(models.ReadinessCheckin(user_id=demo.id, subject=subj, confidence_level=conf))
    
    # --- Notes ---
    notes_data = [
        ("Binary Search Notes", "## Binary Search\n\n- Works on sorted arrays\n- Time: O(log n)\n- Divide and conquer approach\n\n### Implementation\n```python\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid+1\n        else: hi = mid-1\n    return -1\n```", "Data Structures", ["binary-search", "algorithms"], True),
        ("SQL Cheatsheet", "## SQL Quick Reference\n\n- SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY\n- JOINs: INNER, LEFT, RIGHT, FULL\n- Subqueries and nested queries\n- Aggregate functions: COUNT, SUM, AVG, MAX, MIN", "DBMS", ["sql", "reference"], True),
        ("OS Process States", "## Process States\n\n1. New → Ready\n2. Ready → Running\n3. Running → Waiting/Blocked\n4. Running → Ready (preemption)\n5. Running → Terminated", "Operating Systems", ["processes", "os"], False),
    ]
    for title, content, subj, tags, bookmarked in notes_data:
        db.add(models.Note(user_id=demo.id, title=title, content=content, subject=subj, tags=tags, is_bookmarked=bookmarked))
    
    # --- Study Logs (last 30 days) ---
    for i in range(30):
        hrs = round(random.uniform(1, 6), 1) if random.random() > 0.2 else 0
        if hrs > 0:
            db.add(models.StudyLog(
                user_id=demo.id, date=datetime.utcnow() - timedelta(days=i),
                hours_studied=hrs, subjects_covered=random.sample(subjects, min(3, len(subjects))),
                tasks_completed=random.randint(1, 5)
            ))
    
    # --- Notifications ---
    notif_data = [
        ("Welcome to StudyPlatform! 🎓", "Start by creating a study schedule or uploading your first resource.", "info"),
        ("Exam in 3 weeks! 📅", "Your Mid-Semester Exam is approaching. Stay on track!", "alert"),
        ("7-Day Streak! 🔥", "Congratulations! You've maintained a 7-day study streak.", "achievement"),
        ("New Mock Test Available 📝", "A new DBMS Fundamentals test has been added.", "info"),
        ("Daily Reminder 📖", "Don't forget to complete today's study tasks.", "reminder"),
    ]
    for title, msg, ntype in notif_data:
        db.add(models.Notification(user_id=demo.id, title=title, message=msg, notification_type=ntype))
    
    db.commit()
    print("✅ Database seeded successfully!")
    print("Demo credentials: username='demo', password='password123'")


if __name__ == "__main__":
    seed()
    db.close()
