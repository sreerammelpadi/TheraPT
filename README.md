# TheraPT: Transformer-based Empathetic Dialogue System

## Overview

TheraPT is a lightweight, empathetic AI chatbot designed to act as a virtual therapist. Built on a fine-tuned GPT-2 Small model, it provides emotional support through multi-turn conversations while maintaining context over long interactions. The system addresses key challenges in mental health AI by ensuring empathy, coherence, and efficiency—running even on standard laptops without high-end hardware.

Key highlights:
- **Empathetic Responses**: Generates contextually appropriate, supportive replies based on therapeutic dialogue patterns.
- **Long-Range Context Management**: Uses BART for summarizing conversation history, preventing token limit issues in GPT-2 (max 1024 tokens).
- **Reasoning Integration**: Explored chain-of-thought prompting to enhance thoughtful responses (though challenges were encountered in dataset adaptation).
- **Performance**: Achieved a BERTScore F1 of 0.8948 for semantic similarity, with manual testing confirming empathetic and relevant outputs.

This project was developed as part of the CSE 676 Deep Learning course final project. For a detailed walkthrough, refer to the attached presentation (DL-Project-Presentation.pptx) and code (main.ipynb).

## Features

- **Base Model**: GPT-2 Small (124M parameters, ~473MB size) for lightweight deployment.
- **Fine-Tuning**:
  - Primary Dataset: Synthetic Therapy Conversations (~99,000 samples of patient-therapist dialogues).
  - Secondary Dataset: Empathetic Dialogues (~25,000 emotional conversations from Facebook Research) for generalization.
- **Context Summarization**: BART-large-CNN compresses prior exchanges to retain memory without exceeding token limits.
- **Evaluation Metrics**:
  - BLEU Score: 0.0074 (low due to generative nature; not word-for-word matches).
  - BERTScore F1: 0.8948 (strong semantic alignment with reference responses).
- **User Interface**: Simple chat interface for interactive testing (demonstrated in the notebook).
- **Chain-of-Thought Attempt**: Dataset augmented with reasoning steps using OpenAI API (2M+ tokens processed), though format mismatches limited full integration.

The system excels in maintaining empathetic, non-monotonous conversations while being resource-efficient.

## Installation

### Prerequisites
- Python 3.9+
- PyTorch (with CUDA support recommended for training)
- Hugging Face Transformers library

### Setup
1. Clone the repository:

```
git clone https://github.com/your-repo/thera-pt.git
cd thera-pt
```

2. Install dependencies:

```
pip install -r requirements.txt

```

(Note: Create a `requirements.txt` with: `torch`, `transformers`, `datasets`, `pandas`, `nltk`, `bert-score`.)

3. Download datasets (as referenced in the code):
- Synthetic Therapy Conversations (via Kaggle).
- Empathetic Dialogues (via Hugging Face).

## Usage

### Training the Model
Run the Jupyter notebook (`main.ipynb`) to:
- Preprocess datasets.
- Fine-tune GPT-2 on therapy dialogues (3 epochs on primary dataset, 1 epoch on secondary with lower learning rate).
- Integrate BART for summarization.

Example training command (from notebook):

```
trainer.train()
```


### Running the Chatbot
Use the interactive loop in the notebook for testing:

```python
while True:
user_input = input("Patient: ")
if user_input.lower() == "quit":
break
# Generate response with summarization
therapist_response = generate_response(prompt)
print(f"Therapist: {therapist_response}")

```


Sample Interaction:
- **Patient**: I'm feeling disappointed with my job.
- **Therapist**: Hi Charlie, thank you for reaching out. Can you tell me more about what's been going on? What specifically is causing you to feel this way at work and how it's impacting your overall well-being?

For long conversations, BART summaries ensure context retention.

### Evaluation
- Run the evaluation section in `main.ipynb` to compute BLEU and BERTScore on generated vs. reference responses.
- Manual testing: Engage in chats and assess empathy/coherence.

## Architecture

*(Diagram created with LucidChart; see attached PPT for full details.)*

- **Input**: User prompt + summarized history.
- **Processing**: Fine-tuned GPT-2 generates empathetic response.
- **Output**: Therapist-like dialogue with reasoning elements.

## Datasets

- **Synthetic Therapy Conversations**: ~99,000 multi-turn therapy sessions (patient-therapist format).
- **Empathetic Dialogues**: ~25,000 emotional conversations for diversity and empathy.

Preprocessed to format: `Patient: <input> Therapist: <response>`.

## Challenges and Observations

- **Context Loss**: Addressed via BART summarization for sustained coherence.
- **Chain-of-Thought**: Dataset inflation with OpenAI API added reasoning steps, but GPT-2 struggled with the new format.
- **Results**: Strong in semantics (high BERTScore) but low BLEU due to creative, non-literal responses—ideal for dialogue systems.

See the "Observations" and "Other Approaches Tried" sections in the attached PPT for examples and insights.

## Contributors

- Abhijeet Pathak (33%)
- Sreeram Melpadi (33%)
- Jagannath Chivukula (33%)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

***

For more technical details, explore the attached code notebook (main.ipynb) and presentation (DL-Project-Presentation.pptx). If you have questions or improvements, feel free to contribute!
