"""Setup for repatcha XBlock."""

import os
from setuptools import setup


def package_data(pkg, roots):
     """Generic function to find package_data for `pkg` under `root`."""
     data = []
     for root in roots:
         for dirname, _, files in os.walk(os.path.join(pkg, root)):
             for fname in files:
                 data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

     return {pkg: data}


setup(
    name='repatcha-xblock',
    version='0.1',
    description='repatcha XBlock',   # TODO: write a better description.
    packages=[
        'repatcha',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'repatcha = repatcha:RePatchaXBlock',
        ]
    },
    package_data=package_data("repatcha", ["static","public"]),
)
