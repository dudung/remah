from setuptools import setup, find_packages

setup(
    name='remah',
    version='0.0.2',
    packages=find_packages(),
    install_requires=[
        # List your project dependencies here
    ],
    entry_points={
        'console_scripts': [
            # If you have any console scripts, specify them here
        ],
    },
    url='https://github.com/dudung/remah',
    license='MIT',
    author='Sparisoma Viridi',
    author_email='dudung@gmail.com',
    description='python package for mixed modeling approaches',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
)
