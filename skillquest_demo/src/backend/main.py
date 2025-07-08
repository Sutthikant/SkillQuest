from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
api_key = os.getenv("API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = OpenAI(api_key=api_key)

def generate_skilltree(skill_name: str):

    client = OpenAI(
        api_key=api_key
    )

    
    prompt = (f"""
This is a prompt for the main skill that we will decompose.

The objective of this project is to break down a specific skill into a learning path in the form of a skill tree. The goal of the skill tree is to answer the question: “If we want to master this skill, what do we need to learn, and in what order?”

The skill tree must:
- Reflect the logical order and increasing difficulty of subskills (e.g., subskill A must be completed before subskill B).
- Be as deep as necessary (4 to 5 levels or more if needed).
- Use short and concise titles (`name`) for each node/subtopic.
- Include a `description` field for every node that briefly explains the topic (1 to 2 sentences max).
- Decompose each node into very specific and detailed subskills whenever possible. For example, “Variables and Data Types” should be broken down into “Integers”, “Strings”, “Booleans”, etc.
- Avoid grouping unrelated or loosely related topics in a single node. Each node should cover only one distinct concept or unit of learning.
- Include a `prerequisites` field for each node. This field should list the names (or IDs) of other nodes that must be completed before the current one can be accessed. If the node has no prerequisites, return an empty list.
- Include a `done` field that indicates whether the learner has completed this node. The default value must be `false`.
- Add a **"quest"** theme to each node to make it feel like a part of a journey. For instance, topics related to practice should be considered **"practice quests"** (e.g., "Solve the Loop Challenge") and topics related to learning should be **"learning quests"** (e.g., "Unlock the Secret of Variables").
- Include a **"quest_type"** field indicating whether the node is a **"learning quest"** or **"practice quest"**.
- Add a **"reward"** field that gives a fun incentive when the quest is completed, such as "Unlock the next topic" or "Earn experience points."
- Return the result in **pure JSON** format (no additional text or explanation).
- Be structured and ready for integration into a UI.

The main skill is: {skill_name}

Please return the skill tree in the following JSON format:

{{
  "name": "Skill name",
  "description": "Brief description of the overall skill.",
  "prerequisites": [],
  "done": false,
  "quest_type": "learning",
  "reward": "Unlock the next level",
  "children": [
    {{
      "name": "Main Topic 1",
      "description": "Short description of Main Topic 1.",
      "prerequisites": [],
      "done": false,
      "quest_type": "learning",
      "reward": "Unlock Subtopics",
      "children": [
        {{ 
          "name": "Subtopic 1.1", 
          "description": "Short description of Subtopic 1.1.",
          "prerequisites": [],
          "done": false,
          "quest_type": "practice",
          "reward": "Earn XP",
          "children": []
        }},
        {{ 
          "name": "Subtopic 1.2", 
          "description": "Short description of Subtopic 1.2.",
          "prerequisites": ["Subtopic 1.1"],
          "done": false,
          "quest_type": "learning",
          "reward": "Learn the basics",
          "children": [
            {{
              "name": "Sub-subtopic 1.2.1",
              "description": "Short description of Sub-subtopic 1.2.1.",
              "prerequisites": ["Subtopic 1.2"],
              "done": false,
              "quest_type": "practice",
              "reward": "Complete the challenge",
              "children": []
            }}
          ]
        }}
      ]
    }}
  ]
}}
""")


    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    store=True,
    messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in skill dependency graphs."},
            {"role": "user", "content": prompt}
        ],
  )

    content = completion.choices[0].message.content.strip()
    
    return content

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        skill_input = data.get('input')
        result = generate_skilltree(skill_input)
        return jsonify({"tree": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def hello():
    return "Skill tree generator API is running!"

if __name__ == '__main__':
    app.run(debug=True)
