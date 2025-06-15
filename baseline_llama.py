from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

def generate_prerequisites_llama(skill_name: str) -> str:

    pipe = pipeline("text-generation", model="meta-llama/Llama-3.1-8B-Instruct")
    prompt = (
        f"""
        This is a prompt for the main skill that we will decomposed.
        The main objective of this project is to decompose one specific skill into learning path in the form of skill tree which represent that "If we want to study this skill what we need to do".
        This skill tree will consider the order and hardness of each sub skill like subskill A have to be finished before subskill B.
        The main skill is: {skill_name}
        The final output for this project will be skill tree, so please return the decomposed details in form of JSON which ready to pack in to the design.
        """
    )
    messages = [
        {"role": "system", "content": "You are a helpful assistant specialized in skill dependency graphs."},
        {"role": "user", "content": prompt}
    ]
    pipe(messages)


if __name__ == "__main__":
    pass
    # skill = input("Enter a skill name: ")
    # prereqs = generate_prerequisites_llama(skill)
    # print(f"Skill tree for '{skill}':\n{prereqs}")
