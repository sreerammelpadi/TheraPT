import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = GPT2LMHeadModel.from_pretrained(
    "./gpt2_finetuned"
)
model.to(device)

tokenizer = GPT2Tokenizer.from_pretrained(
    "./gpt2_finetuned"
)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token


def generate_response(prompt, max_length=1024, temperature=0.5, top_p=0.8):

    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

    output = model.generate(
        input_ids,
        max_length=max_length,
        temperature=temperature,
        top_p=top_p,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id,
        repetition_penalty=1.4
    )

    response = tokenizer.decode(output[0],
                                skip_special_tokens=True)

    response = response[len(prompt):].strip()
    stop_words = ["Patient:", "User:", "Charlie:", "Therapist:", "\n\n", "Human"]

    for token in stop_words:
        if token in response:
            response = response.split(token)[0].strip()
            break

    return response


def chat_with_model(user_input: str,
                    conversation_history: list[str] = None) -> tuple[str, list[str]]:
    if conversation_history is None:
        conversation_history = []

    conversation_history.append(f"Patient: {user_input}")
    full_prompt = "\n".join(conversation_history) + "\nTherapist:"

    raw = generate_response(full_prompt)
    therapist_response = raw.split("\nPatient:")[0].strip()

    conversation_history.append(f"Therapist: {therapist_response}")
    return therapist_response, conversation_history


def generate_stream(prompt: str, conversation_history) -> str:
 
    resp, conversation_history = chat_with_model(prompt, conversation_history)
    for word in resp.split():
        yield word + " "
