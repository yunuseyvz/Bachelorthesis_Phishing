# https://stackoverflow.com/questions/31392361/how-to-read-eml-file-in-python

import os
import random
import datetime
import email
from email import policy
from email.parser import BytesParser
from email.generator import BytesGenerator
from email.header import decode_header

def randomize_date(eml_file):
    print("Randomizing date for:", eml_file)
    with open(eml_file, 'rb') as f:
        msg = BytesParser(policy=policy.default).parse(f)

    # Extract the original date
    original_date = msg.get('Date')
    print("Original Date:", original_date)
    if original_date:
        # Decode the date 
        decoded_date = decode_header(original_date)[0][0]
        if isinstance(decoded_date, bytes):
            original_date = decoded_date.decode()

        # Parse the original date
        parsed_original_date = email.utils.parsedate_to_datetime(original_date)

        # Generate a random date
        random_seconds = random.randint(-31536000, 31536000)  # +/- 1 year
        randomized_date = parsed_original_date + datetime.timedelta(seconds=random_seconds)
        print("Randomized Date:", randomized_date)

        # Update the Date header with the randomized date
        msg.replace_header('Date', email.utils.format_datetime(randomized_date))

    return msg

def save_randomized_eml(eml_file, randomized_msg):
    with open(eml_file, 'wb') as f:
        generator = BytesGenerator(f)
        generator.flatten(randomized_msg)

    return eml_file

def main():
    eml_folder = 'C:\\Users\\yunus\\OneDrive\\Uni\\Bachelor\\Bachelorthesis\\BA\\shuffle mails\\mails'
    print("EML Folder Path:", eml_folder)
    for filename in os.listdir(eml_folder):
        if filename.endswith('.eml'):
            eml_file = os.path.join(eml_folder, filename)
            randomized_msg = randomize_date(eml_file)
            randomized_eml_file = save_randomized_eml(eml_file, randomized_msg)
            print(f'Randomized email saved to: {randomized_eml_file}')

if __name__ == "__main__":
    main()