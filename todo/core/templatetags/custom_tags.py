from django import template
from random import randint

register = template.Library()

@register.simple_tag(name='get_color')
def color():
    color_values = ['nfl','mlb','nhl','pga']
    return color_values[randint(0, len(color_values)-1)]