from setuptools import setup, find_packages

setup(
    name='remah',
    version='0.0.5',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[
        # Your dependencies
    ],
    tests_require=[
        'unittest',
    ],
    test_suite='tests',
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
