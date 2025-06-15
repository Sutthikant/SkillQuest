from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
api_key = os.getenv("API_KEY")

def generate_prerequisites_gpt(skill_name: str) -> list:

    client = OpenAI(
        api_key=api_key
    )

    
    prompt = (
        f"""
        This is a prompt for the main skill that we will decomposed.
        The main objective of this project is to decompose one specific skill into learning path in the form of skill tree which represent that "If we want to study this skill what we need to do".
        This skill tree will consider the order and hardness of each sub skill like subskill A have to be finished before subskill B.
        The main skill is: {skill_name}
        The final output for this project will be skill tree, so please return the decomposed details in form of JSON which ready to pack in to the design.
        """
    )

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

if __name__ == "__main__":
    skill = input("Enter a skill name: ")
    prereqs = generate_prerequisites_gpt(skill)
    print(f"Prerequisites for '{skill}': {prereqs}")
